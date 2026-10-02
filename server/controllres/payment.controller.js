import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import { Course } from "../models/course.model.js";
import { Payment } from "../models/payment.model.js";
import { Progress } from "../models/progress.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";
import createNotification from "../services/notification.service.js";

const createOrder = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (!course.isPublished) {
    throw new ApiError(400, "Course is not published");
  }

  const isAlreadyEnrolled = course.enrolledStudents.some(
    (student) => student.toString() === req.user.id.toString(),
  );

  if (isAlreadyEnrolled) {
    throw new ApiError(400, "You are already enrolled in this course");
  }

  const amount = course.price * 100;

  const receipt = `c_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt,
  });

  if (!order) {
    throw new ApiError(500, "Failed to create Razorpay order");
  }

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

  return res.status(201).json(
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

const failurePayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    code,
    description,
    reason,
    source,
    step,
  } = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order ID is not found");
  }

  const payment = await Payment.findOne({
    razorpayOrderId: orderId,
    userId: req.user.id,
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status === "paid") {
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "Payment was already successfully processed",
      ),
    );
  }

  payment.status = "failed";

  payment.failureReason = {
    code,
    description,
    reason,
    source,
    step,
    paymentFailedAt: new Date(),
  };

  await payment.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Payment failure recorded successfully",
    ),
  );
});

const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  // --------------------------------------------------
  // 1. Verify Razorpay webhook signature
  // --------------------------------------------------

  console.log("🔥 RAZORPAY WEBHOOK RECEIVED");
console.log("Signature:", req.headers["x-razorpay-signature"]);
console.log("Body exists:", !!req.body);

  const signature = req.headers["x-razorpay-signature"];

  const isValid = verifyRazorpayWebhookSignature(
    req.body,
    signature,
  );

  if (!isValid) {
    throw new ApiError(400, "Invalid Razorpay webhook signature");
  }

  // --------------------------------------------------
  // 2. Parse body AFTER signature verification
  // --------------------------------------------------

  let event;

  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch (error) {
    throw new ApiError(400, "Invalid webhook payload");
  }

  // --------------------------------------------------
  // 3. Only process payment.captured
  // --------------------------------------------------

  if (event.event !== "payment.captured") {
    return res.status(200).json({
      success: true,
      message: "Webhook event ignored",
    });
  }

  // --------------------------------------------------
  // 4. Extract payment entity
  // --------------------------------------------------

  const paymentEntity = event.payload?.payment?.entity;

  if (!paymentEntity) {
    throw new ApiError(
      400,
      "Payment data missing from webhook",
    );
  }

  const {
    id: razorpayPaymentId,
    order_id: razorpayOrderId,
    amount,
    currency,
    status,
    method,
  } = paymentEntity;

  if (!razorpayOrderId || !razorpayPaymentId) {
    throw new ApiError(
      400,
      "Razorpay order/payment ID missing",
    );
  }

  // --------------------------------------------------
  // 5. Find OUR payment record
  // --------------------------------------------------

  const payment = await Payment.findOne({
    razorpayOrderId,
  });

  if (!payment) {
    throw new ApiError(
      404,
      "Payment record not found",
    );
  }

  // --------------------------------------------------
  // 6. IDEMPOTENCY
  // --------------------------------------------------

  if (payment.status === "paid") {
    return res.status(200).json({
      success: true,
      message: "Payment already processed",
    });
  }

  // --------------------------------------------------
  // 7. Validate payment details
  // --------------------------------------------------

  if (status !== "captured") {
    throw new ApiError(
      400,
      "Payment has not been captured",
    );
  }

  if (amount !== payment.amount * 100) {
    throw new ApiError(
      400,
      "Payment amount mismatch",
    );
  }

  if (currency !== payment.currency) {
    throw new ApiError(
      400,
      "Payment currency mismatch",
    );
  }

  if (
    payment.razorpayPaymentId &&
    payment.razorpayPaymentId !== razorpayPaymentId
  ) {
    throw new ApiError(
      400,
      "Payment ID mismatch",
    );
  }

  // --------------------------------------------------
  // 8. MongoDB transaction
  // --------------------------------------------------

  const session = await mongoose.startSession();

  let user;
  let course;

  try {
    session.startTransaction();

    [user, course] = await Promise.all([
      User.findById(payment.userId).session(session),
      Course.findById(payment.courseId).session(session),
    ]);

    if (!user || !course) {
      throw new ApiError(
        404,
        "User or course not found",
      );
    }

    // --------------------------------------------------
    // 9. Idempotent enrollment
    // --------------------------------------------------

    await User.updateOne(
      { _id: payment.userId },
      {
        $addToSet: {
          coursesEnrolledIn: payment.courseId,
        },
      },
      { session },
    );

    await Course.updateOne(
      { _id: payment.courseId },
      {
        $addToSet: {
          enrolledStudents: payment.userId,
        },
      },
      { session },
    );

    // --------------------------------------------------
    // 10. Mark payment as paid
    // --------------------------------------------------

    payment.status = "paid";
    payment.razorpayPaymentId = razorpayPaymentId;

    if (["upi", "card", "netbanking", "wallet", "emi"].includes(method)) {
      payment.paymentMethod = method;
    }

    // --------------------------------------------------
    // 11. Create progress if it doesn't exist
    // --------------------------------------------------

    await Progress.findOneAndUpdate(
      {
        userId: payment.userId,
        courseId: payment.courseId,
      },
      {
        $setOnInsert: {
          userId: payment.userId,
          courseId: payment.courseId,
          lecturesCompleted: [],
        },
      },
      {
        upsert: true,
        new: true,
        session,
      },
    );

    // --------------------------------------------------
    // 12. Save payment
    // --------------------------------------------------

    await payment.save({ session });

    // --------------------------------------------------
    // 13. Commit
    // --------------------------------------------------

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // --------------------------------------------------
  // 14. Notification AFTER successful transaction
  // --------------------------------------------------

  try {
    await createNotification({
      recipient: course.instructor,
      type: "enrolledment_successful",
      title: "New Student Enrollment",
      message: `${user.name} enrolled to your course: ${course.title}`,
      relatedCourse: course._id,
    });
  } catch (error) {
    console.error(
      "Enrollment notification failed:",
      error,
    );
  }

  // --------------------------------------------------
  // 15. Acknowledge webhook
  // --------------------------------------------------

  return res.status(200).json({
    success: true,
    message: "Payment processed successfully",
  });
});

const verifyRazorpayWebhookSignature = (rawBody, signature) => {
  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRET,
    )
    .update(rawBody)
    .digest("hex");

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
};

const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const payment = await Payment.findOne({
    razorpayOrderId: orderId,
    userId: req.user.id,
  }).select(
    "status razorpayOrderId razorpayPaymentId courseId"
  );

  if (!payment) {
    throw new ApiError(
      404,
      "Payment record not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: payment.status,
        orderId: payment.razorpayOrderId,
        paymentId: payment.razorpayPaymentId,
        courseId: payment.courseId,
      },
      "Payment status fetched successfully"
    )
  );
});

export { createOrder, failurePayment, handleRazorpayWebhook,getPaymentStatus};
