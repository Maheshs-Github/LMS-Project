import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifiedUser = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized User");
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findById(decodedToken?._id).select(
      "-password -createdAt -updatedAt -__v"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Account is blocked");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new ApiError(401, "Invalid or expired access token");
    }

    throw error;
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

    if (!user) throw new ApiError(401, "Invalid Access Token");

    if(user.role!=="admin")
      throw new ApiError(403,"Not a Admin");
    req.user=user;

    next();

});

export { verifiedUser,isAdmin };
