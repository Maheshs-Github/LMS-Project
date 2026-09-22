import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Course } from "../models/course.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password,role } = req.body;
  if ([name, email, password,role].some((field) => !field || field.trim() === ""))
    throw new ApiError(400, "All Field are required");

  const createdUser = await User.create({
    name: name,
    email: email,
    password: password,
    role
  });

  const FinalUser=createdUser.toObject();
  delete FinalUser.password;

  const Token = await createdUser.generateToken();

  if (!Token) throw new ApiError(400, "Error While genartaing the Token");


  const options = {
    httpOnly: true,
    // secure: true,
     secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax",
  };

  return res
    .cookie("accessToken", Token, options)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { User: FinalUser,
          //  Token: Token 
          },
        "User has been Created Successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => !field || field.trim() === ""))
    throw new ApiError(400, "Both Email and Password is required");

  const loggedInUser = await User.findOne({ email });
  // find gives the array , but findOne gives the model

  if (!loggedInUser) throw new ApiError(404, "No User Found");


  const isPasswordMatched = await loggedInUser.isPasswordCorrect(password);

  if (!isPasswordMatched) throw new ApiError(401, "Password is not Matched");

  const Token = await loggedInUser.generateToken();


  const options = {
    httpOnly: true,
    // secure: true,
     secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax",
  };

  const FinalLoggedUser = {
    _id: loggedInUser?._id,
    name: loggedInUser?.name,
    email: loggedInUser?.email,
    role: loggedInUser?.role,
    createdAt: loggedInUser?.createdAt,
    updatedAt: loggedInUser?.updatedAt,
  };


  return res
    .cookie("accessToken", Token, options)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { "User": FinalLoggedUser
          // , Tokwn: Token 
        },
        "User has logged in sucessfully",
      ),
    );
});

const loggedOut = asyncHandler(async (req, res) => {

  const Token =
    req?.cookies?.accessToken ||
    req?.header("Authorization").replace("Bearer", "");

  const options = {
    httpOnly: true,
    // secure: true,
     secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax",
  };

  return res
    .clearCookie("accessToken", options)
    .status(200)
    .json(new ApiResponse(200, {}, "Logged Out Successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const updateData = {};
  if (req.file?.path) {
    const PhotoPath = req.file?.path;

    // if (!PhotoPath) throw new ApiError(400, "Photo is Missing");

    const photo = await uploadOnCloudinary(PhotoPath);

    if (!photo.url)
      throw new ApiError(400, "Error Whlile Uploading FIle on Cloudinary");
    updateData.photoUrl = photo?.url;
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

export { registerUser, loginUser, loggedOut, updateUser, enrolledCourses };
