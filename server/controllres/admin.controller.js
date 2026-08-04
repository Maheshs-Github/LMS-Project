import { Course } from "../models/course.model.js";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";
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
  let matchStage = {},
    sortStage = {};

  if (status && status !== "All") matchStage.status = status;

  if (role && role !== "All") matchStage.role = role;

  matchStage.role = { $ne: "admin" };

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

  return res.status(200).json(new ApiResponse(200,{
    Users:result[0]?.users,
    pagination:{
      currentPage,
      pageLimit,
      totalUsers:result[0]?.totalUsers[0].count,
      totalPages:Math.ceil(result[0]?.totalUsers[0].count/ pageLimit)
    }
  }))
});
export { getAdminDashboard, getRecentActivity, getUsers };
