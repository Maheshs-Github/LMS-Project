
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema=mongoose.Schema({
  name:{
    required:true,
    type:String,
    trim:true,
        lowercase:true,
  },
  email:{
    required:true,
    type:String,
    lowercase:true,
    unique:true,
  },
  password:{
    required:true,
    type:String,
  },
  role:{
    type:String,
    enum:["student","instructor"],
    default:"student",
  },
  coursesEnrolledIn:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"course"
  },
  photoUrl:{
    type:String,
  }
},{timestamps:true})

userSchema.pre("save",async function(){
  if(!this.isModified("password")) return;

   this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken=async function () {
  return await jwt.sign({
    _id:this._id,
    name:this.name,
    email:this.email,
  },process.env.TOKEN_KEY,{expiresIn:process.env.TOKEN_EXP_TIME})
}


 export const User=mongoose.model("User",userSchema)
