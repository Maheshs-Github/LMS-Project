import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Progress } from "../models/Progress.model.js";
// import { useState } from "react";

const getInstructorDashboard = asyncHandler(async (req, res) => {
  const instructorid = req?.user._id;
  console.log("req?.role: ", req?.user.role, " req?._id: ", req?.user._id);
  if (req?.user?.role !== "instructor")
    throw new ApiError(403, "Non Instructor can't fetch on this endpoint");

  const [courseCount, studentCount, lectureCount] = await Promise.all([
    Course.find({
      instructor: req?.user?._id,
    }).countDocuments(),
    Course.aggregate([
      {
        $match: {
          instructor: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $project: {
          enrolledCount: {
            $size: "$enrolledStudents",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalStudents: {
            $sum: "$enrolledCount",
          },
        },
      },
    ]),
    Course.aggregate([
      {
        $match: {
          instructor: new mongoose.Types.ObjectId(req?.user?._id),
        },
      },
      {
        $project: {
          lecCount: {
            $size: "$lectures",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLectures: {
            $sum: "$lecCount",
          },
        },
      },
    ]),
    // Course.find({
    //   instructor: req?.user?._id,
    // }),
  ]);

  // const courseCount = await Course.find({
  //   instructor: req?.user?._id,
  // }).countDocuments();
  // console.log("courseCount: ", courseCount);

  // const studentCount1 = await Course.aggregate([
  //   {
  //     $match: {
  //       instructor: new mongoose.Types.ObjectId(req.user?._id),
  //     },
  //   },

  //   {
  //     $project: {
  //       enrolledCount: {
  //         $size: "$enrolledStudents",
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       totalStudents: {
  //         $sum: "$enrolledCount",
  //       },
  //     },
  //   },
  // ]);
  // console.log("studentCount1: ", studentCount1);
  //   courseCount:  5
  // studentCount:  [
  // { _id: new ObjectId('6a1a7630f91aba30565481b8'), enrolledCount: 4 },
  // { _id: new ObjectId('6a1a76b0f91aba30565481b9'), enrolledCount: 2 },
  // { _id: new ObjectId('6a1ad9414c99f8b5630a976e'), enrolledCount: 2 },
  // { _id: new ObjectId('6a1ada514c99f8b5630a976f'), enrolledCount: 0 },
  // { _id: new ObjectId('6a2b9b312e14d13ee194bdb0'), enrolledCount: 0 }

  // const lectureCount = await Course.aggregate([
  //   {
  //     $match: {
  //       instructor: new mongoose.Types.ObjectId(req?.user?._id),
  //     },
  //   },
  //   {
  //     $project: {
  //       lecCount: {
  //         $size: "$lectures",
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       totalLectures: {
  //         $sum: "$lecCount",
  //       },
  //     },
  //   },
  // ]);
  // console.log("lectureCount: ", lectureCount);

  // const completionPercent=await Course.aggregate([
  //   {
  //     $match:{
  //       instructor:new mongoose.Types.ObjectId(req?.user?._id)
  //     }
  //   },
  //   {

  //   }
  // ])

  // const courseData = await Course.find({
  //   instructor: req?.user?._id,
  // });

  console.log("studentCount: ", studentCount);
  console.log("courseCount: ", courseCount);
  console.log("lectureCount: ", lectureCount);
  // console.log("courseData: ",courseData);

  const perCourseCompletion = await Course.aggregate([
    {
      $match: {
        instructor: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "progresses",
        localField: "_id",
        foreignField: "courseId",
        as: "courseProgressDetails",
      },
    },
  ]);

  // console.dir(perCourseCompletion, { depth: null });
  let totalCourseEnrollStudents = 0,
    totalCourseCompletedStudents = 0;
  const coursesData = perCourseCompletion.map((courseData) => {
    // console.log("courseData: ",courseData)
    const courseLen = courseData.lectures.length;
    const enrolledStudents = courseData.enrolledStudents.length;
    totalCourseEnrollStudents += enrolledStudents;
    const completedStudents = courseData.courseProgressDetails.filter(
      (pData) => pData.lecturesCompleted.length === courseLen,
    ).length;
    totalCourseCompletedStudents += completedStudents;
    return {
      title: courseData.title,
      students: enrolledStudents,
      lectures: courseData.lectures.length,
      completedStudents: completedStudents,
      completionRate:
        enrolledStudents > 0 ? (completedStudents / enrolledStudents) * 100 : 0,
    };
  });
  console.log(
    "totalCourseEnrollStudents: ",
    totalCourseEnrollStudents,
    " totalCourseCompletedStudents: ",
    totalCourseCompletedStudents,
  );
  const totalCourseCompletionRate =
    totalCourseEnrollStudents > 0
      ? Math.round(
          (totalCourseCompletedStudents / totalCourseEnrollStudents) * 100,
        )
      : 0;
  // console.log("perCourseCompletion: ",perCourseCompletion);

  // console.log("ans: ",ans);

  // const dashCourses = courseData?.map((course) => ({
  //   title: course?.title,
  //   students: course?.enrolledStudents.length || 0,
  //   lectures: course?.lectures.length || 0,
  // }));
  // console.log("dashCourses: ", dashCourses);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        studentCount: studentCount[0]?.totalStudents || 0,
        lectureCount: lectureCount[0]?.totalLectures || 0,
        courseCount: courseCount,
        coursesData: coursesData,
        totalCourseCompletionRate,
      },
      "DashBoard Data has been fetched successfully",
    ),
  );
});

const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req?.user?._id;
  console.log("req?.user: ", req?.user);
  if (req?.user?.role !== "student")
    throw new ApiError(403, "THis is a Student endpoint, u are not authrized");
  const [courseProgress, enrolledCoursesCount] = await Promise.all([
    Progress.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "UserCourses",
        },
      },
      {
        $unwind: "$UserCourses",
      },
      {
        $addFields: {
          lectureCount: {
            $size: "$UserCourses.lectures",
          },
          completedLectureCount: {
            $size: "$lecturesCompleted",
          },
        },
      },
      {
        $addFields: {
          progressPercentage: {
            $cond: {
              if: { $eq: ["$lectureCount", 0] },
              then: 0,
              else: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ["$completedLectureCount", "$lectureCount"],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          userId: 1,
          courseId: 1,
          courseName: "$UserCourses.title",
          courseSubName: "$UserCourses.subTitle",
          courseThumbnail: "$UserCourses.thumbnail",
          lectureCount: 1,
          completedLectureCount: 1,
          progressPercentage: 1,
        },
      },
    ]),
    Course.find({enrolledStudents:studentId}).countDocuments(),
  ]);
  console.log("courseProgress: ", courseProgress);
  // console.dir(courseProgress, { depth: null });
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseProgress,
        enrolledCoursesCount,
      },
      "DashBoard Data has been fetched successfully",
    ),
  );
});

export { getInstructorDashboard, getStudentDashboard };
