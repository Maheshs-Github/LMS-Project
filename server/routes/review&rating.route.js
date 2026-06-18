import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { addReviewAndRating, getReviewAndratingByCourUser } from "../controllres/review&rating.controller.js";


const router=Router();

router.use(verifiedUser);

router.post("/:courseId",addReviewAndRating)
router.get("/:courseId",getReviewAndratingByCourUser)


export default router;