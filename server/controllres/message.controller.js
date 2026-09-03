import {
  createMessage,
  getMessages,
  isUserAllowedInCourseChat,
} from "../services/chat.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCourseChatMessages = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req?.user?.id;
  if (!courseId) throw new ApiError(400, "Course Id is required");
  const isAllowedToGetMessages = await isUserAllowedInCourseChat(
    userId,
    courseId,
  );
  if (!isAllowedToGetMessages)
    throw new ApiError(403, "Not allowd to access this Chat");
  const messages = await getMessages(courseId);
  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages Fetched Successfully"));
});

const writeMessage = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req?.user?.id;
  const { content } = req.body;
  if (!courseId) throw new ApiError(400, "Course Id is required");
  const isAllowedtoWriteMessages = await isUserAllowedInCourseChat(
    userId,
    courseId,
  );
  if (!isAllowedtoWriteMessages)
    throw new ApiError(403, "Not Allowed to Access this chat");
  const message = await createMessage(userId, courseId, content);
  if (!message) throw new ApiError(404, "Could not able to write the message");

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message has been added to the Chat"));
});

export { getCourseChatMessages, writeMessage };
