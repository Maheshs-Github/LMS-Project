import mongoose from "mongoose";

const LectureSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  videoUrl:{
    type:String,
    required:true,
  },
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
  }
},{timestamps:true})


export const Lecture=mongoose.model("Lecture",LectureSchema);