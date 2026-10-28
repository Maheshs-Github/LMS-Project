import mongoose from "mongoose";

const refreshTokenSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
    index:true,
  },
  tokenHash:{
    type:String,
    required:true,
    unique:true,
  },
  familyId:{
    type:String,
    required:true,
    index:true,
  },
  expiresAt:{
    type:Date,
    required:true,
  },
  revokedAt:{
    type:Date,
    default:null,
  },
  replacedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"refreshToken",
    default:null,
  }
},{timestamps:true})

refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);


export const RefreshToken=new mongoose.model("refreshToken",refreshTokenSchema)