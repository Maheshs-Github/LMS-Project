import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { createCourse } from "../controllres/course.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router=Router();

router.post("",verifiedUser, upload.single("thumbnail"),createCourse)

export default router;