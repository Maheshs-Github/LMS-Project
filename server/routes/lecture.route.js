import Router from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { deleteLecture, getLectureById, updateLecture, uploadLecture } from "../controllres/lecture.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { deleteLectureSchema, updateLectureSchema, uploadLectureSchema } from "../validators/lecture.schema.js";
import { validate } from "../middlewares/validate.middlewares.js";

const router = Router();

router.post("/:courseId", verifiedUser,upload.single("videoUrl"),  validate(uploadLectureSchema), uploadLecture);
router.get("/:lectureId", verifiedUser, getLectureById);
router.patch("/:lectureId", verifiedUser,upload.single("videoUrl"), validate(updateLectureSchema), updateLecture);
router.delete("/:lectureId", verifiedUser,validate(deleteLectureSchema), deleteLecture);


export default router;
