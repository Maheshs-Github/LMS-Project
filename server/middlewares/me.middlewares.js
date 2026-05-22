import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const me=asyncHandler( async(req,res)=>{
  const user=await User.findById(req.user?._id);

  return res.status(200).json(new ApiResponse(200,{User:user},"User Fetched Successfully"));
})

export {me};