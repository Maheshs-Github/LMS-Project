import { Course } from "../models/course.model.js";
import { Progress } from "../models/Progress.model.js";
import { User } from "../models/user.model.js";
import createNotification from "../services/notification.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addLectureProgress = asyncHandler(async (req, res) => {
  const { lectureId, courseId } = req.params;
  const userId = req.user?.id;
  console.log(
    "lectureId, courseId : ",
    lectureId,
    courseId,
    " userId: ",
    userId,
  );
  if (
    [lectureId, userId, courseId].some((field) => !field || field.trim() === "")
  )
    throw new ApiError(
      400,
      "All Course Id , User Id and Lecture Id are required ",
    );

  const [progressStored,course,user] = await Promise.all([
    Progress.findOne({
    userId: userId,
    courseId: courseId,
  }),
    Course.findById(courseId),
    User.findById(userId),
  ])
  let progressData;
  if (!progressStored) {
    progressData = await Progress.create({
      userId: userId,
      courseId: courseId,
      lecturesCompleted: [lectureId],
    });
  } else {
    progressData = await Progress.findOneAndUpdate(
      {
        userId,
        courseId,
      },
      {
        $addToSet: {
          lecturesCompleted: lectureId,
        },
      },
      { new: true },
    );
  }

  if (!progressData)
    throw new ApiError(500, "Could able to track the lecture progress");

  const alreadyCompleted=progressStored?.lecturesCompleted?.some((lecture)=>lecture.toString()===lectureId.toString())

  if(!alreadyCompleted && course?.lectures?.length === progressData?.lecturesCompleted?.length)
  {
    await createNotification({
      recipient:course?.instructor,
      type:"course_completed",
      title:"Student Completed the Course",
      message:`${user?.name} completed your course ${course?.title}`,
      relatedCourse:course?._id,
    })
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        progressData,
        "Lecture has been tracked Successfully",
      ),
    );
});

const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user?.id;

  if (!courseId) throw new ApiError(400, "Course Id is not found");

  const courseProgress = await Progress.findOne({userId,courseId});

  // if(!courseProgress)
  //   throw new ApiError(404,"No Course Progress Found");

  return res.status(200).json(new ApiResponse(200,courseProgress,"Course Progress has been fetched successfully"))
});

export { addLectureProgress,getCourseProgress };
