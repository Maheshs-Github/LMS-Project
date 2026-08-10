import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalInstructors,
    totalCourses,
    totalPublishedCourses,
    totalEnrolledStudents,
    totalRevenue,
    revenueAndEnrollment,
    topSellingCourses,
    topInsructors,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "instructor" }),
    Course.countDocuments(),
    Course.countDocuments({ isPublished: true }),
    Course.aggregate([
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
          totalEnrolledStudents: {
            $sum: "$enrolledCount",
          },
        },
      },
    ]),
    Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevue: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          totalRevenueVal: {
            $round: ["$totalRevue", 0],
          },
        },
      },
    ]),
    Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },

            year: {
              $year: "$createdAt",
            },
          },
          revenue: {
            $sum: "$amount",
          },
          enrollments: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          "_id.year": 1,
          "_id.month": 1,
          revenue: {
            $round: ["$revenue", 0],
          },
          enrollments: 1,
        },
      },
    ]),
    Course.aggregate([
      {
        $project: {
          title: 1,
          price: 1,
          thumbnail: 1,
          description: 1,
          category: 1,

          enrolledCount: {
            $size: "$enrolledStudents",
          },
        },
      },
      {
        $sort: {
          enrolledCount: -1,
        },
      },
      {
        $limit: 2,
      },
    ]),
    // User.aggregate([
    //   {
    //     $match: {
    //       role: "instructor",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "courses",
    //       localField: "_id",
    //       foreignField: "instructor",
    //       as: "instructorCourses",
    //     },
    //   },

    //   {
    //     $project: {
    //       name: 1,
    //       email: 1,
    //       instructorCourses: 1,
    //       coursesSize: {
    //         $size: "$instructorCourses",
    //       },
    //     },
    //   },
    //   {
    //     $unwind: "$instructorCourses",
    //   },
    //   {
    //     $addFields: {
    //       title: "$instructorCourses.title",
    //       studentsEnrolledToCourseSize: {
    //         $size: "$instructorCourses.enrolledStudents",
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         instructor: "$instructorCourses.instructor",
    //       },
    //       name: {
    //         $first: "$name",
    //       },

    //       email: {
    //         $first: "$email",
    //       },

    //       coursesSize: {
    //         $first: "$coursesSize",
    //       },
    //       totalInstructorStudents: {
    //         $sum: "$studentsEnrolledToCourseSize",
    //       },
    //     },
    //   },
    // ]),
    User.aggregate([
      {
        $match: {
          role: "instructor",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "instructor",
          as: "instructorCourses",
        },
      },
      {
        $addFields: {
          coursesSize: {
            $size: "$instructorCourses",
          },
          studentsPerCourse: {
            $size: "$instructorCourses.enrolledStudents",
          },
        },
      },
      {
        $unwind: "$instructorCourses",
      },
      {
        $lookup: {
          from: "payments",
          localField: "instructorCourses._id",
          foreignField: "courseId",
          as: "payments",
        },
      },
      {
        $unwind: "$payments",
      },
      {
        $match: {
          "payments.status": "paid",
        },
      },
      {
        $group: {
          _id: "$_id",
          toatlIntructorRevenue: {
            $sum: "$payments.amount",
          },
          name: {
            $first: "$name",
          },

          email: {
            $first: "$email",
          },

          coursesSize: {
            $first: "$coursesSize",
          },

          totalInstructorStudents: {
            $sum: "$studentsPerCourse",
          },
        },
      },
      {
        $project: {
          _id: 1,
          toatlIntructorRevenue: 1,
          name: 1,
          email: 1,
          coursesSize: 1,
          totalInstructorStudents: 1,
        },
      },
      {
        $sort: { toatlIntructorRevenue: -1 },
      },
      {
        $limit: 2,
      },
    ]),
  ]);

  const enrolledStudents = totalEnrolledStudents[0]?.totalEnrolledStudents ?? 0;

  const revenue = totalRevenue[0]?.totalRevenueVal ?? 0;

  return res.status(200).json(
    new ApiResponse(200, {
      totalStudents,
      totalInstructors,
      totalCourses,
      totalPublishedCourses,
      totalEnrolledStudents: enrolledStudents,
      totalRevenue: revenue,
      revenueAndEnrollment,
      topSellingCourses,
      topInsructors,
    }),
  );
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const [recentPayments, recentUsers, recentCoursePublished] =
    await Promise.all([
      Payment.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        { $unwind: "$course" },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            studentName: "$user.name",
            courseName: "$course.title",
            amount: 1,
            createdAt: 1,
          },
        },
      ]),
      User.aggregate([
        {
          $match: {
            role: { $ne: "admin" },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            name: 1,
            role: 1,
            createdAt: 1,
          },
        },
      ]),
      Course.aggregate([
        {
          $match: {
            isPublished: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "instructor",
            foreignField: "_id",
            as: "instructor",
          },
        },
        { $unwind: "$instructor" },
        {
          $sort: {
            updatedAt: -1,
          },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            instructorName: "$instructor.name",
            title: 1,
            updatedAt: 1,
          },
        },
      ]),
    ]);

  console.log("recentCoursePublished: ", recentCoursePublished);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        recentPayments,
        recentUsers,
        recentCoursePublished,
      },
      "Recent Activities fetched successfully",
    ),
  );
});

const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 2,
    searchValue,
    role = "All",
    status = "All",
    sortBy = "latest",
  } = req.query;

  console.log("role: ", role);
  let matchStage = {},
    sortStage = {};

  if (status === "active") {
    matchStage.isBlocked = false;
  }

  if (status === "blocked") {
    matchStage.isBlocked = true;
  }

  if (role && role !== "All") {
    matchStage.role = role;
  } else {
    matchStage.role = { $ne: "admin" };
  }

  if (searchValue) {
    matchStage.$or = [
      {
        name: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }
  console.log("match: ", matchStage);

  switch (sortBy) {
    case "oldest": {
      sortStage = { createdAt: 1 };
      break;
    }

    default:
      sortStage = { createdAt: -1 };
  }

  const currentPage = Number(page);
  const pageLimit = Number(limit);
  const skip = (currentPage - 1) * pageLimit;

  const result = await User.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        users: [
          {
            $sort: sortStage,
          },
          {
            $skip: skip,
          },
          {
            $limit: pageLimit,
          },
          {
            $project: {
              name: 1,
              email: 1,
              role: 1,
              isBlocked: 1,
              createdAt: 1,
            },
          },
        ],
        totalUsers: [
          {
            $count: "count",
          },
        ],
      },
    },
  ]);
  // console.log(
  //   "Users: ",
  //   result[0].users,
  //   " totalUsers: ",
  //   result[0].totalUsers[0].count,
  // );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        Users: result[0]?.users,
        pagination: {
          currentPage,
          pageLimit,
          totalUsers: result[0]?.totalUsers[0].count ?? 0,
          totalPages:
            Math.ceil(result[0]?.totalUsers[0].count / pageLimit) ?? 0,
        },
      },
      "User Data has been Fetched Successfully",
    ),
  );
});

const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new ApiError(400, "User Id is not Found");

  const user = await User.findById(userId).select("role");

  console.log("user: ", user);

  if (!user) throw new ApiError(400, "User  not Found");

  let userData;
  if (user.role === "student") {
    userData = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "userId",
          as: "payments",
        },
      },
      {
        $unwind: "$payments",
      },
      {
        $lookup: {
          from: "courses",
          localField: "payments.courseId",
          foreignField: "_id",
          as: "courses",
        },
      },
      {
        $unwind: "$courses",
      },

      // 2nd
      {
        $lookup: {
          from: "progresses",

          let: {
            userId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                },
              },
            },
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course",
              },
            },
            {
              $unwind: "$course",
            },
            {
              $lookup: {
                from: "certificates",
                let: {
                  studentId: "$userId",
                  courseId: "$course._id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$student", "$$studentId"] },
                          { $eq: ["$courseId", "$$courseId"] },
                        ],
                      },
                    },
                  },
                ],
                as: "certificate",
              },
            },
            {
              $project: {
                _id: 0,

                courseName: "$course.title",

                courseLectureCount: {
                  $size: "$course.lectures",
                },

                completedLectureCount: {
                  $size: "$lecturesCompleted",
                },

                completionPerc: {
                  $cond: [
                    { $gt: [{ $size: "$course.lectures" }, 0] },
                    {
                      $multiply: [
                        {
                          $divide: [
                            { $size: "$lecturesCompleted" },
                            { $size: "$course.lectures" },
                          ],
                        },
                        100,
                      ],
                    },
                    0,
                  ],
                },
                certificateAvailable: {
                  $gt: [{ $size: "$certificate" }, 0],
                },
              },
            },
          ],
          as: "progress",
        },
      },

      {
        $group: {
          _id: "$_id",

          name: { $first: "$name" },
          email: { $first: "$email" },
          role: { $first: "$role" },

          isBlocked: { $first: "$isBlocked" },
          blockReason: { $first: "$blockReason" },
          blockedAt: { $first: "$blockedAt" },
          blockedBy: { $first: "$blockedBy" },
          createdAt: { $first: "$createdAt" },

          payments: {
            $push: {
              amount: "$payments.amount",
              status: "$payments.status",
              createdAt: "$payments.createdAt",
              courseName: "$courses.title",
            },
          },
          progress: {
            $first: "$progress",
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          isBlocked: 1,
          blockReason: 1,
          blockedAt: 1,
          blockedBy: 1,
          createdAt: 1,
          payment: "$payments",
          progress: "$progress",
        },
      },
    ]);
  }
  if (user.role === "instructor") {
    userData = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "instructor",
          as: "course",
        },
      },

      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          isBlocked: 1,
          blockReason: 1,
          blockedAt: 1,
          blockedBy: 1,
          createdAt: 1,
          // course: "$course",
          coursesCount: {
            $size: "$course",
          },
          studentsCount: {
            $sum: {
              $map: {
                input: "$course",
                as: "course",
                in: {
                  $size: "$$course.enrolledStudents",
                },
              },
            },
          },
          revenue: {
            $sum: {
              $map: {
                input: "$course",
                as: "course",
                in: {
                  $multiply: [
                    { $size: "$$course.enrolledStudents" },
                    "$$course.price",
                  ],
                },
              },
            },
          },
          published: {
            $size: {
              $filter: {
                input: "$course",
                as: "course",
                cond: {
                  $eq: ["$$course.isPublished", true],
                },
              },
            },
          },
          course: {
            $map: {
              input: "$course",
              as: "course",
              in: {
                _id: "$$course._id",
                title: "$$course.title",
                price: "$$course.price",
                students: {
                  $size: "$$course.enrolledStudents",
                },
                isPublished: "$$course.isPublished",
              },
            },
          },
          courseRevenue: {
            $map: {
              input: "$course",
              as: "course",
              in: {
                courseName: "$$course.title",
                revenue: {
                  $multiply: [
                    { $size: "$$course.enrolledStudents" },
                    "$$course.price",
                  ],
                },
              },
            },
          },
        },
      },
    ]);
  }

  console.log("user: ", userData);
  return res
    .status(200)
    .json(new ApiResponse(200, userData, "User data fetched successfully"));
});

const toggleBlockStatus = asyncHandler(async (req, res) => {
  const { userId, blockStatus, blockReason } = req.body;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  if (typeof blockStatus !== "boolean") {
    throw new ApiError(400, "Invalid block status");
  }

  if (blockStatus && (!blockReason || blockReason.trim() === ""))
    throw new ApiError(400, "Block Reaseon is required");

  const updateData = {};
  updateData.isBlocked = blockStatus;
  if (blockStatus) {
    updateData.blockReason = blockReason;
    updateData.blockedBy = req.user?.id;
    updateData.blockedAt = new Date();
  } else {
    updateData.blockReason = null;
    updateData.blockedBy = null;
    updateData.blockedAt = null;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    { new: true },
  );

  if (!updatedUser)
    throw new ApiError(
      404,
      "User not found or could not able to Update teh Status",
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        "User Bloack Staus has been updated successfully",
      ),
    );
});
export {
  getAdminDashboard,
  getRecentActivity,
  getUsers,
  getUser,
  toggleBlockStatus,
};
