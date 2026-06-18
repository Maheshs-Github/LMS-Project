import mongoose from "mongoose";

const ReviewAndRatingSchema = mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    courseId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
    rating: {
      required: true,
      type: Number,
    },
    review: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const ReviewAndRating=mongoose.model("ReviewAndRating",ReviewAndRatingSchema)
