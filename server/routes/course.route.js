import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { courseEnroll, createCourse, getAllCourses, getCourseById, getCourseLectures, getMyCourses, updateCourse } from "../controllres/course.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router=Router();

router.post("",verifiedUser, upload.single("thumbnail"),createCourse);
router.get("",getAllCourses);
router.get("/myCourses",verifiedUser,getMyCourses);
router.get("/:courseId",getCourseById);
router.post("/:courseId",verifiedUser,courseEnroll);
router.patch("/:courseId",verifiedUser,upload.single("thumbnail"),updateCourse);
router.get("/:courseId/lectures",verifiedUser,getCourseLectures);


export default router;
