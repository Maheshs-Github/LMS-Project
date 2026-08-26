import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { ReviewAndRating } from "../models/review&rating.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Progress } from "../models/Progress.model.js";

const createCourse = asyncHandler(async (req, res) => {
  // console.log("Body: ",req.body);
  // console.log("File: ",req.file);
  const { title, subTitle, category, level, price, description } = req.body;
  console.log("req User: ", req?.user);
  if (
    [title, subTitle, category, level, price, description].some(
      (field) => !field || field.trim() === "",
    )
  )
    throw new ApiError(400, "All fields are required");

  const thumbnailPath = req.file.path;
  console.log("thumbnailPath: ", thumbnailPath);

  const uploadedThumb = await uploadOnCloudinary(thumbnailPath);
  console.log("photo fromCloud: ", uploadedThumb);

  if (!uploadedThumb.url)
    throw new ApiError(
      400,
      "There was error while uploading the Thumbnail on cloudinary",
    );

  const createdCourse = await Course.create({
    title,
    subTitle,
    category,
    level,
    price,
    description,
    thumbnail: uploadedThumb.url,
    instructor: req?.user?.id,
  });

  if (!createCourse)
    throw new ApiError(400, "There was Error while crating the Course");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createCourse,
        "Course has been created successfully",
      ),
    );
});

const getMyCourses = asyncHandler(async (req, res) => {
  const instructorCourses = await Course.find({
    instructor: req.user?.id,
  }).select("title price isPublished status");
  // console.log("instructorCourses: ",instructorCourses);
  if (instructorCourses.length === 0)
    throw new ApiError(404, "NO Courses Found ");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        instructorCourses,
        "My Courses has been fetched Successfully",
      ),
    );
});

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) throw new ApiError(400, "Id is Missing");
  console.log("courseId: ", courseId);
  const fetchedCourse = await Course.findOne({
    _id: courseId,
    // we are showing inthe student side so inructor matcjhing is commented for now
    // instructor: req.user.id,
  })
    .populate("lectures", "-__v -updatedAt -createdAt -course")
    .populate("instructor", "name");

  // console.log("fetchedCourse: ", fetchedCourse);
  if (!fetchedCourse) throw new ApiError(404, "Course not found");

  const courseReviewData = await Course.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $lookup: {
        from: "reviewandratings",
        localField: "_id",
        foreignField: "courseId",
        as: "courseReview",
      },
    },
  ]);
  // console.log("courseReview: ", courseReviewData[0]?.courseReview);
  let courseRatingSum = 0,
    reviewCount = courseReviewData[0]?.courseReview?.length ?? 0;
  (courseReviewData[0]?.courseReview || []).forEach(
    (rData) => (courseRatingSum += Number(rData.rating)),
  );

  // console.log("courseRatingSum: ",courseRatingSum," reviewCount: ",reviewCount, "hello")

  const courseAvgRating = reviewCount > 0 ? courseRatingSum / reviewCount : 0;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { fetchedCourse, reviewCount, courseAvgRating },
        "Course Data has been Fetched Successfully",
      ),
    );
});

const updateCourse = asyncHandler(async (req, res) => {
  // console.log("body: ", req.body);
  const { title, subTitle, category, level, price, description } = req.body;
  // console.log("req User: ", req?.user);
  const { courseId } = req.params;

  const course = await Course.findOne({
    _id: courseId,
    instructor: req.user.id,
  });
  if (!course) throw new ApiError(404, "No Course Found");

  const updateData = {
    title,
    subTitle,
    category,
    level,
    price,
    description,
  };

  if (req.file) {
    const thumbnailPath = req.file.path;
    console.log("thumbnailPath: ", thumbnailPath);

    const uploadedThumb = await uploadOnCloudinary(thumbnailPath);
    console.log("photo fromCloud: ", uploadedThumb);

    if (!uploadedThumb.url)
      throw new ApiError(
        400,
        "There was error while uploading the Thumbnail on cloudinary",
      );
    updateData.thumbnail = uploadedThumb.url;
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    { _id: courseId, instructor: req.user.id },
    {
      $set: updateData,
    },
    {
      new: true,
    },
  );

  if (!updatedCourse)
    throw new ApiError(400, "There was Error while updating the Course");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCourse,
        "Course has been Updated successfully",
      ),
    );
});

const getCourseLectures = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) throw new ApiError(400, "No Course Id Found");

  // const courseLectures = await Lecture.find({ course: courseId });
  const courseLectures = await Course.findById(courseId).populate("lectures");
  console.log("couser lec: ", courseLectures);
  // if (!courseLectures.length ) throw new ApiError(404, "No Lectures Found");
  if (!courseLectures) throw new ApiError(404, "No Lectures Found");

  const count = courseLectures?.lectures?.length;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { course: courseLectures, lectureCount: count },
        "Course Lectures has been fetched successfully",
      ),
    );
});

const getAllCourses = asyncHandler(async (req, res) => {
  const { searchValue, sortBy, category, page = 1, limit = 2 } = req.query;
  // console.log("searchValue: ",searchValue," sortBy: ",sortBy);
  const matchStage = {};
  matchStage.isPublished = true;

  if (category && category !== "All") matchStage.category = category;

  if (searchValue) {
    matchStage.$or = [
      {
        title: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        description: {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }
  // matchStage.status="approved";

  let sortStage = {};
  switch (sortBy) {
    case "price-low":
      sortStage = { price: 1 };
      break;

    case "price-high":
      sortStage = { price: -1 };
      break;

    case "rating":
      sortStage = { averageRating: -1 };
      break;

    default:
      sortStage = { createdAt: -1 };
  }

  const currentPage = Number(page);
  const pageLimit = Number(limit);
  const skip = (currentPage - 1) * pageLimit;

  // const courses = await Course.find().populate(
  //   "instructor",
  //   "-__v -updatedAt -createdAt -password",
  // );

  // const courseReviewData = await Course.aggregate([
  //   {
  //     $lookup: {
  //       from: "reviewandratings",
  //       localField: "_id",
  //       foreignField: "courseId",
  //       as: "courseReviews",
  //     },
  //   },
  // ]);
  // // console.log("courseReviewData: ", courseReviewData);
  // const reviewData = courseReviewData.map((d1) => {
  //   let ratingtotal = 0;
  //   const courserevlen = d1.courseReviews.length;

  //   // console.log("len: ", courserevlen);
  //   // console.log("courseReviews: ",d1.courseReviews)
  //   d1?.courseReviews.forEach((d2) => (ratingtotal += Number(d2.rating)));
  //   // console.log("ratingtotal: ",ratingtotal)
  //   return {
  //     courseId: d1._id,
  //     avg: courserevlen > 0 ? Number(ratingtotal / courserevlen) : 0,
  //     reviewCount: courserevlen,
  //   };
  // });
  // // console.log("data: ",data)
  // if (!courses) throw new ApiError(404, "No Courses not Found");
  // // console.log("courses: ", courses);

  // const ans = courses.map((course) => {
  //   const courseReview = reviewData.find(
  //     (d) => d.courseId.toString() === course._id.toString(),
  //   );
  //   // const reData=data.find( (d) => console.log("d: ",d))
  //   return {
  //     ...course.toObject(),
  //     averageRating: courseReview?.avg || 0,
  //     reviewCount: courseReview?.reviewCount || 0,
  //   };
  // });
  const totalCourses = await Course.find(matchStage).countDocuments();
  // console.log("totalCourse: ",totalCourses);
  // let's see how we can do more effeciently
  const courseReviewData = await Course.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor",
      },
    },
    {
      $unwind: "$instructor",
    },
    {
      $lookup: {
        from: "reviewandratings",
        localField: "_id",
        foreignField: "courseId",
        as: "courseReviews",
      },
    },
    {
      $addFields: {
        averageRating: {
          $avg: "$courseReviews.rating",
        },
        reviewCount: {
          $size: "$courseReviews",
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        price: 1,
        level: 1,
        thumbnail: 1,
        averageRating: 1,
        reviewCount: 1,
        enrolledStudents: 1,

        "instructor._id": 1,
        "instructor.name": 1,
        "instructor.email": 1,
        "instructor.photoUrl": 1,
      },
    },
    {
      $sort: sortStage,
    },
    {
      $skip: skip,
    },
    {
      $limit: pageLimit,
    },
  ]);

  console.log("courseReviewData: ", courseReviewData);
  // console.log("ans: ", ans);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseReviewData,
        pagination: {
          totalCourses,
          totalPages: pageLimit > 0 ? Math.ceil(totalCourses / pageLimit) : 0,
          currentPage,
          pageLimit,
        },
      },
      "Courses has been succcessfully",
    ),
  );
});

const courseEnroll = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;
  console.log("courseId: ", courseId);

  if ([courseId, userId].some((field) => !field || field.trim() === ""))
    throw new ApiError(400, "CourseId and UserId both are required");
  // const updatedCourse=await Course.findByIdAndUpdate(courseId,{$addToSet:{enrolledStudents:userId}},{new:true});
  // const updateuser=await User.findByIdAndUpdate(userId,{$addToSet:{coursesEnrolledIn:courseId}},{new :true});

  const [updatedCourse, updateuser, updateProgress] = await Promise.all([
    Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true },
    ),
    User.findByIdAndUpdate(
      userId,
      { $addToSet: { coursesEnrolledIn: courseId } },
      { new: true },
    ),
    Progress.findOneAndUpdate(
      {
        userId,
        courseId,
      },
      {
        $setOnInsert: {
          userId,
          courseId,
          lecturesCompleted: [],
        },
      },
      {
        upsert: true,
        new: true,
      },
    ),
  ]);
  if (!updatedCourse) throw new ApiError(404, "Course not found ");
  if (!updateuser) throw new ApiError(401, "User Not Found");
  if (!updateProgress) throw new ApiError(401, "Progess not tracked");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCourse, "Course Enrollment is successful"),
    );
});

const updateCourseStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { isPublished } = req.body;

  if (typeof isPublished !== "boolean")
    throw new ApiError(400, "Invlaid Pusblish Status");

  const course = await Course.findOne({
    _id: courseId,
    instructor: req.user.id,
  }).populate("lectures");

  if (!course) throw new ApiError(404, "No Course Found");

  if (isPublished) {
    const errors = [];

    if (!course.title) errors.push("Title");
    if (!course.description) errors.push("Description");
    if (!course.thumbnail) errors.push("Thumbnail");
    if (!course.category) errors.push("Category");
    if (!course.level) errors.push("Level");
    if (course.price <= 0) errors.push("Price");
    if (course.lectures.length === 0) errors.push("At least one lecture");

    if (errors.length > 0) {
      throw new ApiError(
        400,
        `Complete the following before publishing: ${errors.join(", ")}`,
      );
    }
  }

  const updatedCourse = await Course.findOneAndUpdate(
    {
      _id: courseId,
      instructor: req.user.id,
    },
    {
      $set: {
        isPublished,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedCourse) {
    throw new ApiError(
      404,
      "Course not found or you are not authorized to update it.",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCourse,
        isPublished
          ? "Course published successfully."
          : "Course unpublished successfully.",
      ),
    );
});

const submitCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) throw new ApiError(400, "Course Id required");

  const course = await Course.findOne({
    _id: courseId,
    instructor: req.user?.id,
    status: { $in: ["draft", "rejected"] },
  }).populate("lectures");

  if (!course) throw new ApiError(404, "Course not found");

  let errors = [];
  if (!course.title) errors.push("title");
  if (!course.subTitle) errors.push("subTitle");
  if (!course.description) errors.push("description");
  if (course.price == null || course.price <= 0) errors.push("price");
  if (!course.level) errors.push("level");
  if (!course.thumbnail) errors.push("thumbnail");
  if (course?.lectures.length <= 0) errors.push("at least 1 lecture ");

  if (errors.length > 0)
    throw new ApiError(
      400,
      `Follwing Fields are required to filled: ${errors.join(",")}`,
    );

  const submittedCourse = await Course.findOneAndUpdate(
    {
      _id: courseId,
      instructor: req.user.id,
      status: { $in: ["draft", "rejected"] },
    },
    {
      $set: {
        status: "pending",
        rejectionReason: null,
      },
    },
    { new: true },
  );

  if (!submittedCourse) throw new ApiError(404, "Course not found ");

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Course Sent for Admin Approval Successfully"),
    );
});

export {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  getCourseLectures,
  getAllCourses,
  courseEnroll,
  updateCourseStatus,
  submitCourse,
};
