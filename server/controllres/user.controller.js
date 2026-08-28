import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Course } from "../models/course.model.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("req.body: ", req.body);
  const { name, email, password,role } = req.body;
  if ([name, email, password,role].some((field) => !field || field.trim() === ""))
    throw new ApiError(400, "All Field are required");

  const createdUser = await User.create({
    name: name,
    email: email,
    password: password,
    role
  });
  console.log("createdUser: ", createdUser);

  const FinalUser=createdUser.toObject();
  delete FinalUser.password;

  const Token = await createdUser.generateToken();

  if (!Token) throw new ApiError(400, "Error While genartaing the Token");

  // console.log("Token: ",Token)

  // const decoddToken=await jwt.verify(Token,process.env.TOKEN_KEY)

  // res.status(200).json({"msg":"Okay",Data:createdUser,Token:Token,decoddToken:decoddToken})

  const options = {
    httpOnly: true,
    // secure: true,
     secure: process.env.NODE_ENV === "production",
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
  console.log("req.body: ", req.body);
  const { email, password } = req.body;
  if ([email, password].some((field) => !field || field.trim() === ""))
    throw new ApiError(400, "Both Email and Password is required");

  const loggedInUser = await User.findOne({ email });
  // find gives the array , but findOne gives the model

  if (!loggedInUser) throw new ApiError(404, "No User Found");

  //   console.log("User:", loggedInUser);
  // console.log("Type:", loggedInUser?.constructor?.name); //model
  // console.log("Method:", loggedInUser?.isPasswordCorrect);

  const isPasswordMatched = await loggedInUser.isPasswordCorrect(password);

  if (!isPasswordMatched) throw new ApiError(401, "Password is not Matched");

  // console.log("isPasswordMatched: ",isPasswordMatched)
  const Token = await loggedInUser.generateToken();

  console.log("Token: ", Token);

  const options = {
    httpOnly: true,
    // secure: true,
     secure: process.env.NODE_ENV === "production",
  };

  // console.log("loggedInUser: ", loggedInUser);
  const FinalLoggedUser = {
    _id: loggedInUser?._id,
    name: loggedInUser?.name,
    email: loggedInUser?.email,
    role: loggedInUser?.role,
    createdAt: loggedInUser?.createdAt,
    updatedAt: loggedInUser?.updatedAt,
  };

  // console.log("FinalLoggedUser: ", FinalLoggedUser);

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
  //  console.log("Hello from log out")
  //  console.log("req.user: ",req.user);
  //  return res.status(200).json(new ApiResponse(200,{user:req.user},"Logged User data has been fteched succesfully"))

  const Token =
    req?.cookies?.accessToken ||
    req?.header("Authorization").replace("Bearer", "");
  console.log("Token: ", Token);

  const options = {
    httpOnly: true,
    // secure: true,
     secure: process.env.NODE_ENV === "production",
  };

  return res
    .clearCookie("accessToken", options)
    .status(200)
    .json(new ApiResponse(200, {}, "Logged Out Successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  console.log("name: ", name, " EMail: ", email);
  console.log("Req: ", req.body);
  // if ([name, email].some((field) => !field || field.trim() === ""))
  //   throw new ApiError(400, "All Fields Required");
  console.log("Files: ", req.file);

  const updateData = {};
  if (req.file?.path) {
    const PhotoPath = req.file?.path;
    console.log("PhotoPath: ", PhotoPath);

    // if (!PhotoPath) throw new ApiError(400, "Photo is Missing");

    const photo = await uploadOnCloudinary(PhotoPath);
    console.log("photo fromCloud: ", photo);

    if (!photo.url)
      throw new ApiError(400, "Error Whlile Uploading FIle on Cloudinary");
    updateData.photoUrl = photo?.url;
  }
  if (name?.trim()) updateData.name = name;
  if (email?.trim()) updateData.email = email;
  for (const key in updateData) {
    console.log("key: ", key, " Val: ", updateData[key]);
  }

  const updatedProfile = await User.findByIdAndUpdate(
    req.user?._id,
    updateData,
    { new: true },
  ).select("-__v -updatedAt -createdAt -password");
  console.log("updatedProfile: ", updatedProfile);

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
