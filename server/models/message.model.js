import mongoose from "mongoose";

const MessageSchema=new mongoose.Schema({
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true,
  },
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  content:{
    type:String,
      trim: true,
  },

},{timestamps:true})

export const Message=mongoose.model("Message",MessageSchema);