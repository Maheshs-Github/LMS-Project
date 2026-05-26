import { Router } from "express";
import { loggedOut, loginUser, registerUser, updateUser } from "../controllres/user.controllers.js";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { me } from "../middlewares/me.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router=Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",verifiedUser,loggedOut);
router.get("/me",verifiedUser,me);
router.patch("/profile",verifiedUser, upload.single("photoUrl") ,updateUser)


export default router;