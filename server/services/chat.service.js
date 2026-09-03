import { Course } from "../models/course.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";

const isUserAllowedInCourseChat = async (userId, courseId) => {
  const course = await Course.findById(courseId).select(
    "instructor enrolledStudents",
  );

  if (!course) throw new ApiError(404, "Course not found");

  const isIntsrucor = userId.toString() === course.instructor.toString();
  const isCourseStudent = course.enrolledStudents.some(
    (student) => student.toString() === userId.toString(),
  );

  return isIntsrucor || isCourseStudent;
};

const createMessage = async (senderId, courseId, content) => {
  if (!content || content.trim() === "") throw new ApiError(400, "No Content");
  if (!senderId || !courseId)
    throw new ApiError(400, "Both Course Id and Sender Id is required");

  const createdMessage = await Message.create({
    sender: senderId,
    course: courseId,
    content: content.trim(),
  });
  return createdMessage;
};

const getMessages = async (courseId) => {
  const messages = await Message.find({ course: courseId })
    .populate("sender", "name")
    .sort({ createdAt: 1 });
  return messages;
};

export { isUserAllowedInCourseChat, createMessage, getMessages };
