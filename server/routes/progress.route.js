import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { addLectureProgress, getCourseProgress } from "../controllres/progress.controller.js";

const router=Router();

router.use(verifiedUser);

router.post("/:courseId/:lectureId",addLectureProgress);
router.get("/:courseId",getCourseProgress)

export default router;