import { Router } from "express";
import { enrolledCourses, loggedOut, loginUser, registerUser, updateUser } from "../controllres/user.controller.js";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { me } from "../middlewares/me.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router=Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",verifiedUser,loggedOut);
router.get("/me",verifiedUser,me);
router.patch("/profile",verifiedUser, upload.single("photoUrl") ,updateUser)
router.get("/:userId/enrolledCourse",verifiedUser,enrolledCourses)


export default router;