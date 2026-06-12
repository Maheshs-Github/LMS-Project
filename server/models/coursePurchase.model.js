import mongoose from "mongoose";

const coursePurchasedSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    paymentId: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
    },
  },
  { timestamps: true },
);

export const CoursePurchase = new mongoose.model(
  "CoursePurchase",
  coursePurchasedSchema,
);
