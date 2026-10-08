import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadLecture = asyncHandler(async (req, res) => {
  const { title} = req.validated.body;
  const {courseId}=req.validated.params;
  if (!req.file) throw new ApiError(400, "Video File is Missing ");
  const uploadFile = await uploadOnCloudinary(req.file.path);
  const isCourseExist = await Course.findById(courseId);
  if (!isCourseExist) throw new ApiError(404, "Course is not found");

  const addedVideo = await Lecture.create({
    title,
    videoUrl: uploadFile.secure_url,
    course: courseId,
  });

  if (!addedVideo) throw new ApiError(404, "Failed to add the Video");

  await Course.findByIdAndUpdate(courseId, {
    $push: {
      lectures: addedVideo._id,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, addedVideo, "Video has been Added Successfully"),
    );
});
const getLectureById = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  if (!lectureId) throw new ApiError(400, "No Lecture Id is Found");

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) throw new ApiError(404, "No Lecture is Found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, lecture, "Lecture has been fateched succesfully"),
    );
});

const updateLecture = asyncHandler(async (req, res) => {
  const { title } = req.validated.body;
  const { lectureId } = req.validated.params;
  const updatedData = {};
  if (req.file) {
    const upploadedfile = await uploadOnCloudinary(req.file.path);
    if (!upploadedfile)
      throw new ApiError(500, "Error while updating the Video");

    updatedData.videoUrl = upploadedfile.secure_url;
  }
  if (title !== undefined) {
    updatedData.title = title;
  }

  if (Object.keys(updatedData).length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  const updatedLecture = await Lecture.findByIdAndUpdate(
    lectureId,
    { $set: updatedData },
    { new: true },
  );

  if (!updatedLecture)
    throw new ApiError(404, "Error while updating the Lecture");


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedLecture,
        "Lecture has been Updated Successfully",
      ),
    );
});

const deleteLecture=asyncHandler(async(req,res)=>{
  const {lectureId}=req.validated.params;

  const deletedLecture=await Lecture.findByIdAndDelete(lectureId);

  if(!deletedLecture)
    throw new ApiError(404,"Lecture is not FOund");

  return res.status(200).json(new ApiResponse(204,{},"Lecture has been deleted Successfully"));
})
export { uploadLecture, getLectureById, updateLecture, deleteLecture };
