import Router from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { deleteLecture, getLectureById, updateLecture, uploadLecture } from "../controllres/lecture.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.post("/:courseId", verifiedUser,upload.single("videoUrl"), uploadLecture);
router.get("/:lectureId", verifiedUser, getLectureById);
router.patch("/:lectureId", verifiedUser,upload.single("videoUrl"), updateLecture);
router.delete("/:lectureId", verifiedUser, deleteLecture);


export default router;
