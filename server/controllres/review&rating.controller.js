import { ReviewAndRating } from "../models/review&rating.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addReviewAndRating = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { courseId } = req.params;
  const { rating, review } = req.body;
  // console.log("Hwllo");

  if ([courseId, review].some((field) => !field || field.trim() === ""))
    throw new ApiError(400, "CourseId , review  are required");

  if (!rating) throw new ApiError(400, "rating is required");

  const isReviewGiven = await ReviewAndRating.findOne({ userId, courseId });

  let reviewData;

  if (isReviewGiven) {
    reviewData = await ReviewAndRating.findOneAndUpdate(
      { userId, courseId },
      { $set: { review, rating } },
      { new: true },
    );
  } else {
    reviewData = await ReviewAndRating.create({
      userId,
      courseId,
      rating,
      review,
    });
  }

  // console.log("courseId,rating,review: ", courseId, rating, review);

  // console.log("addedReview: ", addedReview);
  if (!reviewData) throw new ApiError(500, "Could not able to add the review ");

  return res
    .status(200)
    .json(new ApiResponse(200, reviewData, "Review and Rating has been added"));
});

const getReviewAndratingByCourUser=asyncHandler(async(req,res)=>{
  const {courseId}=req.params;
  const userId=req?.user?._id;
  if(!courseId)
    throw new ApiError(400,"Course Id is found");

  const fetchedReview=await ReviewAndRating.findOne({courseId,userId});

  return res.status(200).json(new ApiResponse(200,fetchedReview,"course Review has been fetched "));
})

export { addReviewAndRating , getReviewAndratingByCourUser};
