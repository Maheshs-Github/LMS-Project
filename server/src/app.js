import express from "express";
import cors from "cors";
import userRouter from "../routes/user.routes.js"
import courseRouter from "../routes/course.route.js"

import cookieParser from "cookie-parser"


const app=express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}))

app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/course",courseRouter)


app.use((err,req,res,next)=>{
  res.status(err.statusCode ||500).json({
    message:"Something Went Wrong"|| err.message,
    error:err.errors,
    success:false,
  })
})

export {app}