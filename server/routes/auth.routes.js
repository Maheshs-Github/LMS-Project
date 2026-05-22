import { Router } from "express";
import { me } from "../middlewares/me.middlewares.js";
import { verifiedUser } from "../middlewares/auth.middlewares.js";


const router=Router();

router.get("/me",verifiedUser,me);

export default router;