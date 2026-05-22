import { Router } from "express";
import { loggedOut, loginUser, registerUser } from "../controllres/user.controllers.js";
import { verifiedUser } from "../middlewares/auth.middlewares.js";

const router=Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",verifiedUser,loggedOut);


export default router;