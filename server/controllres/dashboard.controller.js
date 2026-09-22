import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Progress } from "../models/progress.model.js";
import { User } from "../models/user.model.js";


const getInstructorDashboard = asyncHandler(async (req, res) => {
  const instructorid = req?.user._id;
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
  ]);



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

  let totalCourseEnrollStudents = 0,
    totalCourseCompletedStudents = 0;
  const coursesData = perCourseCompletion.map((courseData) => {
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
        enrolledStudents > 0
          ? Math.round((completedStudents / enrolledStudents) * 100)
          : 0,
    };
  });
  const totalCourseCompletionRate =
    totalCourseEnrollStudents > 0
      ? Math.round(
          (totalCourseCompletedStudents / totalCourseEnrollStudents) * 100,
        )
      : 0;


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

// Student Dashboard
const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req?.user?._id;
  if (req?.user?.role !== "student")
    throw new ApiError(403, "THis is a Student endpoint, u are not authrized");
  const [courseProgress, recentEnrolledCourses] = await Promise.all([
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
  ]);
  const enrolledCourses = courseProgress?.length;

  let notStartedCourses = 0,
    inProgessCourses = 0,
    completedCourses = 0;
  courseProgress?.forEach((progressData) => {
    const cPercnt = progressData?.progressPercentage;
    if (cPercnt === 0) notStartedCourses++;
    else if (cPercnt === 100) completedCourses++;
    else if (cPercnt > 0 && cPercnt < 100) inProgessCourses++;
  });

  //
  // Recommended Section

  // getting User courses Id
  const userEnrolledCoursesIds =
    await User.findById(studentId).select("coursesEnrolledIn");

  if (!userEnrolledCoursesIds) throw new ApiError(400, "No User Found");

  // if no courses getting the latest courses posted
  if (userEnrolledCoursesIds?.coursesEnrolledIn?.length === 0) {
    const recommendedCourses = await Course.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 4,
      },
    ]);
    return recommendedCourses;
  }

  // let's fetch teh categories from teh Course by Id
  const userEnrolledCourseCate = await Course.find({
    _id: { $in: userEnrolledCoursesIds.coursesEnrolledIn },
  }).select("category");
  // ?remove duplicate categories
  const categories = [
    ...new Set(userEnrolledCourseCate?.map((course) => course.category)),
  ];

  // we have categories then let's get teh recommndation by reviews count and rating
  // Recommend Courses
  const recommendedCourses = await Course.aggregate([
    {
      $match: {
        category: { $in: categories },
        _id: { $nin: userEnrolledCoursesIds?.coursesEnrolledIn },
      },
    },
    {
      $lookup: {
        from: "reviewandratings",
        localField: "_id",
        foreignField: "courseId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: {
          $ifNull: [{ $avg: "$reviews.rating" }, 0],
        },
        reviewCount: {
          $size: "$reviews",
        },
      },
    },
    {
      $sort: {
        averageRating: -1,
        reviewCount: -1,
        createdAt: -1,
      },
    },
    {
      $project: {
        title: 1,
        thumbnail: 1,
        category: 1,
        price: 1,
        averageRating: 1,
        reviewCount: 1,
      },
    },
    {
      $limit: 4,
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseProgress,
        recentEnrolledCourses,
        enrolledCourses,
        notStartedCourses,
        inProgessCourses,
        completedCourses,
        recommendedCourses,
      },
      "DashBoard Data has been fetched successfully",
    ),
  );
});

export { getInstructorDashboard, getStudentDashboard };
