import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifiedUser = asyncHandler(async (req, res, next) => {
  try {
    // console.log("req.cookies: ",req.cookies)
    const Token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    console.log("Tokn: ", Token);
    if (!Token) throw new ApiError(401, "Unauthrized User");

    const decodedToken = await jwt.verify(Token, process.env.TOKEN_KEY);

    // console.log("decodedToken: ",decodedToken)

    const user = await User.findById(decodedToken?._id).select(
      "-password -createdAt -updatedAt -__v",
    );

    // console.log("user: ",user);
    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;
    // console.log("req.user: ",req.user)
    next();
  } catch (error) {
    console.log("There is been some Error: ", error);
    throw new ApiError(401, error?.message || "Invalid Access");
  }
});

const isAdmin = asyncHandler(async (req, res,next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");
  if (!token)
     throw new ApiError(401, "Unauthrized User");

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findById(decodedToken?._id).select(
      "-password -createdAt -updatedAt -__v",
    );

    // console.log("user: ",user);
    if (!user) throw new ApiError(401, "Invalid Access Token");

    if(user.role!=="admin")
      throw new ApiError(403,"Not a Admin");
    req.user=user;

    next();

});

export { verifiedUser,isAdmin };
