import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import { Course } from "../models/course.model.js";
import { Payment } from "../models/payment.model.js";
import { Progress } from "../models/Progress.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

const createOrder = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) throw new ApiError(400, "No CourseId found");

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "No Course Found");
  if (!course.isPublished) throw new ApiError(400, "Course is not published");

  if (
    course.enrolledStudents.some(
      (student) => student.toString() === req.user.id.toString(),
    )
  )
    throw new ApiError(400, "Can't Enroll Again");

  const amount = course.price * 100;

  const receipt = `c_${Date.now()}`;

  const options = {
    amount,
    currency: "INR",
    receipt,
  };
  const order = await razorpay.orders.create(options);

  console.log("order: ", order);

  if (!order) throw new ApiError(500, "Failed to create the Razorpay order");

  const payment = await Payment.create({
    userId: req.user.id,
    courseId: course._id,
    amount: course.price,
    currency: "INR",
    status: "created",
    razorpayOrderId: order.id,
    receipt,
  });

  if (!payment) {
    throw new ApiError(500, "Failed to create payment record");
  }
  return res.status(200).json(
    new ApiResponse(
      201,
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
      "Order created successfully",
    ),
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !courseId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      throw new ApiError(400, "Missing payment details");
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) throw new ApiError(400, "No Payment Found");

    if (payment.status === "paid") throw new ApiError(400, "Already paid");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new ApiError(400, "Payment verification failed");
    }

    const [user, course] = await Promise.all([
      User.findById(req.user.id),
      Course.findById(courseId),
    ]);

    if (!user || !course)
      throw new ApiError(404, "User or Course is not Found");

    const isEnrolledAlready = course.enrolledStudents.some(
      (uIds) => uIds.toString() === req.user.id.toString(),
    );

    if (isEnrolledAlready)
      throw new ApiError(400, "Student is Already Enrolled");

    // 7. Enroll student
    user.coursesEnrolledIn.push(courseId);
    course.enrolledStudents.push(req.user.id);

    // 8. Update payment
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;

    // 9. Save everything
    await Promise.all([
      user.save({ session }),
      course.save({ session }),
      payment.save({ session }),
      Progress.findOneAndUpdate(
        {
          userId: req.user.id,
          // userId,
          courseId,
        },
        {
          $setOnInsert: {
            userId: req.user.id,
            courseId,
            lecturesCompleted: [],
          },
        },
        {
          upsert: true,
          new: true,
          session,
        },
      ),
    ]);

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Payment Verified and Student Enrolled Successfully",
        ),
      );
  } catch (error) {
    console.log("Error: ", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const failurePayment = asyncHandler(async (req, res) => {
  const { orderId, code, description, reason, source } = req.body;

  if (!orderId) throw new ApiError(400, "Order Id is not found");

  const payment = await Payment.findOne({
    razorpayOrderId: orderId,
    userId: req.user.id,
  });

  if (!payment) throw new ApiError(400, "Payment not found");

  if (payment.status === "paid")
    throw new ApiError(400, "Payment is already Successful ");

  payment.status = "failed";

  payment.failureReason = {
    code,
    description,
    reason,
    source,
    step,
  };
  payment.paymentFailed = new Date();

  await payment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Payment failure recorded successfully"));
});

export { createOrder, verifyPayment, failurePayment };
