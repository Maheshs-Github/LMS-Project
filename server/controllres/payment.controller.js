import razorpay from "../config/razorpay.js";
import { Course } from "../models/course.model.js";
import { Payment } from "../models/payment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

  console.log("order: ",order)

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

export { createOrder };
