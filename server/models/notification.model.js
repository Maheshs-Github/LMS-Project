import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "course_approved",
      "course_rejected",
      "course_submitted",
      "enrolledment_successful",
      "course_completed",
      "general",
    ],
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  realtedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

export const Notification=mongoose.model("Notification",notificationSchema)