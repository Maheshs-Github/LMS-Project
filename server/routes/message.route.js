import Router from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { getCourseChatMessages, writeMessage } from "../controllres/message.controller.js";
import { getCourseChatMessagesSchema, writeMessageSchema } from "../validators/message.schema.js";
import { validate } from "../middlewares/validate.middlewares.js";

const router=Router();

router.get("/:courseId",verifiedUser,  validate(getCourseChatMessagesSchema),getCourseChatMessages);
router.post("/:courseId",verifiedUser,validate(writeMessageSchema),writeMessage);


export default router; 