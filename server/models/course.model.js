import mongoose from "mongoose";

const courseSchama=new mongoose.Schema({
  courseTitle:{
    required:true,
    type:String,
  },
  subTitle:{
    type:String,
  },
  description:{
    type:String,
    required:true,
  },
  category:{
    required:true,
    type:String,
  },
  courseLevel:{
    type:String,
    enum:["Beginner","Moderate","Advance"],
    required:true,
  },
  courseThumbnail:{
    type:String,
    required:true,
  },
  enrolledStudents:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }
  ],
  lectures:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Lecture"
  }
  ],
  creator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  isPublished:{
    type:Boolean,
    default:false,
  }
},{timestamps:true});

export const Course=mongoose.model("User",courseSchama);