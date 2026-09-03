import Router from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { getCourseChatMessages, writeMessage } from "../controllres/message.controller.js";

const router=Router();

router.get("/:courseId",verifiedUser,getCourseChatMessages);
router.post("/:courseId",verifiedUser,writeMessage);


export default router;