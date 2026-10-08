import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { addLectureProgress, getCourseProgress } from "../controllres/progress.controller.js";
import { addLectureProgressSchema } from "../validators/progress.schema.js";

const router=Router();

router.use(verifiedUser);

router.post("/:courseId/:lectureId",validate(addLectureProgressSchema),addLectureProgress);
router.get("/:courseId",getCourseProgress)

export default router;