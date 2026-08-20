import mongoose from "mongoose";

const courseSchama = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    subTitle: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    level: {
      type: String,
      enum: ["Beginner", "Moderate", "Advance"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "active", "rejected"],
      default: "draft",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Course = mongoose.model("Course", courseSchama);
