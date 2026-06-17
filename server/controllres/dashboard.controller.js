import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { useState } from "react";

const getInstructorDashboard = asyncHandler(async (req, res) => {
  const instructorid = req?.user._id;
  console.log("req?.role: ", req?.user.role, " req?._id: ", req?.user._id);
  if (req?.user?.role !== "instructor")
    throw new ApiError(403, "Non Instructor can't fetch on this endpoint");

  const [courseCount, studentCount, lectureCount, courseData] =
    await Promise.all([
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
      Course.find({
        instructor: req?.user?._id,
      }),
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
      $lookup:{
        from:"progresses",
        localField:"_id",
        foreignField:"courseId",
        as: "courseProgressDetails",
      }
    },
  ]);

  // console.dir(perCourseCompletion, { depth: null });
  const ans=perCourseCompletion.map((courseData)=>{
    const courseLen=courseData.lectures.length;    
    return(courseData.courseProgressDetails.filter((pData)=>
      {
        return(pData.lecturesCompleted.length===courseLen)
      }
    ).length);
    // console.log("courseData: ",courseData)
  })
  
  console.log("ans: ",ans);

  const dashCourses = courseData?.map((course) => ({
    title: course?.title,
    students: course?.enrolledStudents.length || 0,
    lectures: course?.lectures.length || 0,
  }));
  console.log("dashCourses: ", dashCourses);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        studentCount: studentCount[0].totalStudents,
        lectureCount: lectureCount[0].totalLectures,
        courseCount: courseCount,
        courseData: dashCourses,
      },
      "DashBoard Data has been fetched successfully",
    ),
  );
});

export { getInstructorDashboard };
