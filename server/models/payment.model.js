import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    amount: {
      type: Number,
      min: 1,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    razorpaySignature: {
      type: String,
      unique: true,
      sparse: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["upi", "card", "netbanking", "wallet", "emi"],
      default: "upi",
    },
    failureReason: {
      type: String,
    },

    receipt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);
