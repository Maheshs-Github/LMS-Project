import express from "express";
import cors from "cors";
import userRouter from "../routes/user.routes.js"
import authRouter from "../routes/auth.routes.js"

import cookieParser from "cookie-parser"


const app=express();

app.use(cors({
  origin:process.env.ORIGIN,
  Credential:true,
}))

app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRouter)


app.use((err,req,res,next)=>{
  res.status(err.statusCode ||500).json({
    message:err.message,
    error:err.errors,
    success:false,
  })
})

export {app}