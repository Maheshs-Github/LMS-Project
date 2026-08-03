import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";

const createDefaultAdmin = async (req, res) => {
  try {
    

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if(!ADMIN_NAME || ! ADMIN_EMAIL || !ADMIN_PASSWORD)
    throw new ApiError(400,"Credentionals Missing in .env");

  const existingAdmin=await User.findOne({email:ADMIN_EMAIL});

  if(existingAdmin){
    console.log("ADMIN alredy exists💫")
  return;
}
if(!existingAdmin){
  await User.create({
    name:ADMIN_NAME,
    email:ADMIN_EMAIL,
    password:ADMIN_PASSWORD,
    role:"admin",
  })
  console.log("ADMIN has been created successfully✅");
}

  } catch (error) {
    console.error("❌ Failed to create default admin:", error.message);
    throw error;
  }
};


export default createDefaultAdmin;