import { Router } from "express";
import { enrolledCourses, loggedOut, loginUser, registerUser, updateUser } from "../controllres/user.controller.js";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { me } from "../middlewares/me.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { registerRateLimiter,loginRateLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { loginSchema, registerSchema } from "../validators/auth.schema.js";


const router=Router();

router.post("/login", loginRateLimiter,  validate(loginSchema), loginUser);
router.post("/register", registerRateLimiter,validate(registerSchema), registerUser);
router.post("/logout",verifiedUser,loggedOut);
router.get("/me",verifiedUser,me);
router.patch("/profile",verifiedUser, upload.single("photoUrl") ,updateUser)
router.get("/:userId/enrolledCourse",verifiedUser,enrolledCourses)


export default router;