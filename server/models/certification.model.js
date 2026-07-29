import mongoose from "mongoose";

const certificationSchema=new mongoose.Schema({
  certificateId:{
    type:String,
    required:true,
  },
  student:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"user",
  },
  courseId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"course",
  },
    instructor:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"user",
  },
  completionDate:{
    type:Date,
    required:true,
  }

},{timestamps:true})


export const Certificate=mongoose.model("certificate",certificationSchema);