import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
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
    instructor: req.user.id,
  });
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

  if (req.file.path) {
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

  const courseLectures = await Lecture.find({ course: courseId });
  // const courseLectures = await Course.findById(courseId).populate("lectures");
  console.log("couser lec: ", courseLectures);
  if (!courseLectures.length ) throw new ApiError(404, "No Lectures Found");
  // if (!courseLectures ) throw new ApiError(404, "No Lectures Found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        courseLectures,
        "Course Lectures has been fetched successfully",
      ),
    );
});

export {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  getCourseLectures,
};
