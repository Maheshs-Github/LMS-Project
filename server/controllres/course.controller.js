import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { ReviewAndRating } from "../models/review&rating.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
  }).select("title price isPublished");
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
  console.log("fetchedCourse: ", fetchedCourse);
  if (!fetchedCourse) throw new ApiError(404, "Course not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        fetchedCourse,
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
  const courses = await Course.find().populate(
    "instructor",
    "-__v -updatedAt -createdAt -password",
  );



  const courseReviewData = await Course.aggregate([
    {
      $lookup: {
        from: "reviewandratings",
        localField: "_id",
        foreignField: "courseId",
        as: "courseReviews",
      },
    },
  ]);
  // console.log("courseReviewData: ", courseReviewData);
  const reviewData = courseReviewData.map((d1) => {
    let ratingtotal = 0;
    const courserevlen = d1.courseReviews.length;

    // console.log("len: ", courserevlen);
    // console.log("courseReviews: ",d1.courseReviews)
    d1?.courseReviews.forEach((d2) => (ratingtotal += Number(d2.rating)));
    // console.log("ratingtotal: ",ratingtotal)
    return {
      courseId: d1._id,
      avg:courserevlen>0 ? Number(ratingtotal / courserevlen):0,
      reviewCount: courserevlen,
    };
  });
  // console.log("data: ",data)
  if (!courses) throw new ApiError(404, "No Courses not Found");
  // console.log("courses: ", courses);

  const ans = courses.map((course) => {
    const courseReview  = reviewData.find(
      (d) => d.courseId.toString() === course._id.toString(),
    );
    // const reData=data.find( (d) => console.log("d: ",d))
    return {
      ...course.toObject(),
      averageRating: courseReview ?.avg || 0,
      reviewCount: courseReview ?.reviewCount || 0,
    };
  });
  console.log("ans: ", ans);
  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses has been succcessfully"));
});

const courseEnroll = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;
  console.log("courseId: ", courseId);

  if ([courseId, userId].some((field) => !field || field.trim() === ""))
    throw new ApiError(400, "CourseId and UserId both are required");
  // const updatedCourse=await Course.findByIdAndUpdate(courseId,{$addToSet:{enrolledStudents:userId}},{new:true});
  // const updateuser=await User.findByIdAndUpdate(userId,{$addToSet:{coursesEnrolledIn:courseId}},{new :true});

  const [updatedCourse, updateuser] = await Promise.all([
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
  ]);
  if (!updatedCourse) throw new ApiError(404, "Course not found ");
  if (!updateuser) throw new ApiError(401, "User Not Found");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCourse, "Course Enrollment is successful"),
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
};
