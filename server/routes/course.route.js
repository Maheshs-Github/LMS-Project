import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { createCourse, getAllCourses, getCourseById, getCourseLectures, getMyCourses, updateCourse } from "../controllres/course.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router=Router();

router.post("",verifiedUser, upload.single("thumbnail"),createCourse);
router.get("",verifiedUser,getAllCourses);
router.get("/myCourses",verifiedUser,getMyCourses);
router.get("/:courseId",verifiedUser,getCourseById);
router.patch("/:courseId",verifiedUser,upload.single("thumbnail"),updateCourse);
router.get("/:courseId/lectures",verifiedUser,getCourseLectures);


export default router;
