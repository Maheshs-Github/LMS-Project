import express from "express";
import cors from "cors";
import userRouter from "../routes/user.routes.js"
import courseRouter from "../routes/course.route.js"
import lectureRouter from "../routes/lecture.route.js"
import progressRouter from "../routes/progress.route.js"
import dashboardRouter from "../routes/dashboard.route.js"
import reviewAndRatingRouter from "../routes/review&rating.route.js"
import paymentRouter from "../routes/payment.route.js"
import certificateRouter from "../routes/certificate.route.js"
import adminRouter from "../routes/admin.route.js"
import notificationRouter from "../routes/notification.route.js"
import messageRouter from "../routes/message.route.js"



import cookieParser from "cookie-parser"


const app=express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE","OPTIONS"],
}));

app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/course",courseRouter)
app.use("/api/v1/lecture",lectureRouter)
app.use("/api/v1/progress",progressRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/reviewAndRating",reviewAndRatingRouter)
app.use("/api/v1/payment",paymentRouter)
app.use("/api/v1/certificate",certificateRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/notification",notificationRouter)
app.use("/api/v1/message",messageRouter)



app.use((err,req,res,next)=>{
  console.log("err: ",err)
  res.status(err.statusCode ||500).json({
    message: err.message || "Something Went Wrong",
    error:err.errors,
    success:false,
  })
})

export {app}