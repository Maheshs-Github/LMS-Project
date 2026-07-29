import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { Progress } from "../models/Progress.model.js";
import { Certificate } from "../models/certification.model.js";
import crypto from "crypto";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  generateCertificateId,
  generateCertificatePdf,
} from "../utils/certificate.util.js";

const downloadCertificate = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId))
    throw new ApiError(400, "Invalid Course Id");

const course = await Course.findById(courseId)
  .populate("lectures")
  .populate("instructor", "name");

  if (!course) throw new ApiError(404, "Course not found");

  const progress = await Progress.findOne({
    userId,
    courseId,
  });

  if (!progress) throw new ApiError(404, "Progress not found ");

  const totalLectures = course.lectures.length;
  const completedLectures = progress.lecturesCompleted.length;

  const percantage =
    totalLectures === 0
      ? 0
      : Math.round((completedLectures / totalLectures) * 100);

  if (percantage < 100)
    throw new ApiError(400, "Complete the course to download the certificate");

  let certificate = await Certificate.findOne({
    student: userId,
    courseId,
  });

  if (!certificate) {
    certificate = await Certificate.create({
      certificateId: generateCertificateId(),
      student: userId,
      courseId,
      instructor: course.instructor,
      completionDate: new Date(),
    });
  }

  generateCertificatePdf({
    res,
    certificate,
    student: req.user,
    course,
    instructor: course.instructor?.name,
  });

  // return res
  //   .status(200)
  //   .json(
  //     new ApiResponse(200, certificate, "certification validated successfully"),
  //   );
});

export { downloadCertificate };
