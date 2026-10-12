import { Router } from "express";
import { verifiedUser } from "../middlewares/auth.middlewares.js";
import { addReviewAndRating, getReviewAndratingByCourUser } from "../controllres/review&rating.controller.js";
import { addReviewAndRatingSchema } from "../validators/reviewAndRating.schema.js";
import { validate } from "../middlewares/validate.middlewares.js";


const router=Router();

router.use(verifiedUser);

router.post("/:courseId",validate(addReviewAndRatingSchema),addReviewAndRating)
router.get("/:courseId",getReviewAndratingByCourUser)


export default router;