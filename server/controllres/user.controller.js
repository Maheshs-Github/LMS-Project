import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import {
  createRefreshToken,
  hashRefreshToken,
  accessCookieOptions,
  refreshCookieOptions,
} from "../services/refreshToken.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const issueTokens = async (user, res, familyId) => {
  const accessToken = user.generateToken();
  const refresh = await createRefreshToken(user._id, familyId);

  res.cookie("accessToken", accessToken, {
    ...accessCookieOptions(),
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refresh.token, refreshCookieOptions());
};

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  photoUrl: user.photoUrl,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "Unable to register with this email");

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: "student",
  });

  await issueTokens(user, res);

  return res.status(201).json(
    new ApiResponse(201, { User: safeUser(user) }, "Registration successful")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "Account is blocked");
  }

  await issueTokens(user, res);

  return res.status(200).json(
    new ApiResponse(200, { User: safeUser(user) }, "Login successful")
  );
});

const refreshSession = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.refreshToken;

  if (!rawToken) {
    throw new ApiError(401, "Refresh token required");
  }

  const tokenHash = hashRefreshToken(rawToken);
  const current = await RefreshToken.findOne({ tokenHash });

  if (!current) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // Reuse of a rotated token revokes the affected session family.
  if (current.revokedAt) {
    await RefreshToken.updateMany(
      { familyId: current.familyId, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    throw new ApiError(401, "Session revoked. Please log in again.");
  }

  if (current.expiresAt <= new Date()) {
    throw new ApiError(401, "Refresh token expired");
  }

  const user = await User.findById(current.user);

  if (!user || user.isBlocked) {
    await RefreshToken.updateMany(
      { familyId: current.familyId, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    throw new ApiError(401, "Session is no longer valid");
  }

  const next = await createRefreshToken(user._id, current.familyId);

  // Only one request can successfully rotate this token.
  const rotated = await RefreshToken.findOneAndUpdate(
    {
      _id: current._id,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        revokedAt: new Date(),
        replacedBy: next.record._id,
      },
    },
    { new: true }
  );

  if (!rotated) {
    await RefreshToken.deleteOne({ _id: next.record._id });

    await RefreshToken.updateMany(
      { familyId: current.familyId, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    throw new ApiError(401, "Refresh token reuse detected");
  }

  res.cookie("accessToken", user.generateToken(), {
    ...accessCookieOptions(),
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", next.token, refreshCookieOptions());

  return res.status(200).json(
    new ApiResponse(200, { User: safeUser(user) }, "Session refreshed")
  );
});

const loggedOut = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.refreshToken;

  if (rawToken) {
    const current = await RefreshToken.findOne({
      tokenHash: hashRefreshToken(rawToken),
    });

    if (current) {
      await RefreshToken.updateMany(
        { familyId: current.familyId, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );
    }
  }

  res.clearCookie("accessToken", accessCookieOptions());
  res.clearCookie("refreshToken", {
    ...refreshCookieOptions(),
    maxAge: undefined,
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Logged out successfully")
  );
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const updateData = {};
  if (req.file?.path) {
    const PhotoPath = req.file?.path;

    // if (!PhotoPath) throw new ApiError(400, "Photo is Missing");

    const photo = await uploadOnCloudinary(PhotoPath);

    if (!photo.secure_url)
      throw new ApiError(400, "Error Whlile Uploading FIle on Cloudinary");
    updateData.photoUrl = photo?.secure_url;
  }
  if (name?.trim()) updateData.name = name;
  if (email?.trim()) updateData.email = email;

  const updatedProfile = await User.findByIdAndUpdate(
    req.user?._id,
    updateData,
    { new: true },
  ).select("-__v -updatedAt -createdAt -password");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProfile,
        "Profile has been UPdated Successfully",
      ),
    );
});

const enrolledCourses = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new ApiError(400, "No user Id found");

  const userEnrolledCourses = await Course.find({
    enrolledStudents: userId,
  }).populate("instructor", "-__v -updatedAt -createdAt -password");
  if (!userEnrolledCourses.length)
    throw new ApiError(404, "No Courses of USer Found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userEnrolledCourses,
        "My Learning is Successfully Fetched",
      ),
    );
});


export {
  registerUser,
  loginUser,
  loggedOut,
  refreshSession,
  updateUser,
  enrolledCourses
};