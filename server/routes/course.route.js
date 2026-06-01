import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { createCourse, getCourseById, getMyCourses, updateCourse } from "../controllres/course.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router=Router();

router.post("",verifiedUser, upload.single("thumbnail"),createCourse);
router.get("",verifiedUser,getMyCourses);
router.get("/:courseId",verifiedUser,getCourseById);
router.patch("/:courseId",verifiedUser,upload.single("thumbnail"),updateCourse);


export default router;