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
import razorpayWebhookRouter from "../routes/razorpaywebhook.route.js"
import cookieParser from "cookie-parser"
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import requestLogger from "../middlewares/requestLogger.middleware.js";
import { getSitemap } from "../controllres/sitemap.controller.js";
import helmet from "helmet";


const app=express();
const allowedOrigins = [
  "https://e-learn-flow.netlify.app",
  "https://lms-mahesh.duckdns.org",
];

app.get('/', (req, res) => {
  res.send(`Your IP address is: ${req.ip}`);
  console.log(`Your IP address is: ${req.ip}`)
});


app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost during development
      const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin);

      // Allow production frontend
      const isProduction = allowedOrigins.includes(origin);

      if (isLocalhost || isProduction) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(requestLogger);

app.use(cookieParser())
app.use(helmet());

// Razorpay webhook MUST come before express.json()
app.use(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
    (req, res, next) => {
    console.log("🔥 WEBHOOK ROUTE REACHED");
    next();
  },
  razorpayWebhookRouter,
);

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
app.get("/sitemap.xml", getSitemap);



app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});


app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  if (err instanceof SyntaxError && "body" in err) {
  err.statusCode = 400;
  err.message = "Invalid JSON payload";
}


if (err.name === "ValidationError") {
  err.statusCode = 400;
  err.message = "Invalid data provided";
}

if (err.code === 11000) {
  err.statusCode = 409;
  err.message = "A record with this value already exists";
}


  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode <= 599
      ? err.statusCode
      : 500;

  // Log the error on the server, not through the API response.
  // console.error("Request error:", err);
  logger.error("Request error", {
  message: err.message,
  statusCode,
  stack: err.stack,
  method: req.method,
  path: req.originalUrl,
});

  // Show expected client errors, but hide unexpected server details in production.
  const message =
    statusCode < 500
      ? err.message || "Request failed"
      : isProduction
        ? "Internal Server Error"
        : err.message || "Something went wrong";

  const response = {
    success: false,
    message,
  };

  // Preserve field-level errors for client-side validation.
  if (statusCode < 500 && Array.isArray(err.errors) && err.errors.length > 0) {
    response.errors = err.errors;
  }

  // Stack traces are available only during development.
  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});


export {app}