import { User } from "../models/user.model.js";
import { createMessage, isUserAllowedInCourseChat } from "../services/chat.service.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

let io;

export const initializeSocket = (socketServer) => {
  io = socketServer;

  io.use(async (socket, next) => {
    try {
      console.log("Socket Authentication has been Started");
      const cookie = socket?.handshake?.headers?.cookie;
      console.log("Socket Cookie: ", cookie);
      const accessToken = cookie
        ?.split(";")
        ?.find((item) => item?.trim()?.startsWith("accessToken="))
        ?.split("=")[1];
      console.log("accessToken: ", accessToken);
      if (!accessToken) throw new ApiError(401, "Unauthrized User");

      const decodedToken = jwt.verify(accessToken, process.env.TOKEN_KEY);

      console.log("decodedToken: ", decodedToken);

      const user = await User.findById(decodedToken?._id).select(
        "-password -createdAt -updatedAt -__v",
      );
      socket.user = user;
      console.log("✅ Socket authenticated:", user._id);
      next();
    } catch (error) {
      console.log("❌ Socket authentication error:", error);
      next(error);
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // User socket Connection 
    const userRoom = `user:${socket.user._id}`;
    socket.join(userRoom);

    console.log("Joined user room:", userRoom);

    // Chat Socket connection
    socket.on("chat:join", async (courseId) => {
      try {
        const isAllowed = await isUserAllowedInCourseChat(
          socket?.user?._id,
          courseId,
        );
        if (!isAllowed)
          return socket.emit("chat:error", {
            message: "Unable to join the Chat",
          });
        const courseRoom = `course:${courseId}`;
        socket.join(courseRoom);
        console.log(`👥 ${socket.user._id} joined ${courseRoom}`);
      } catch (error) {
        console.error("Error While Joining Chat: ", error);
        socket.emit("chat:error", {
          message: error.message || "Unable to join the Chat",
        });
      }
    });

    // Chat Message Socket Connection 
    socket.on("chat:message",async({courseId,content})=>{
      try {
        const isAllowed= await isUserAllowedInCourseChat(socket?.user?._id,courseId);
        if(!isAllowed)
          return socket.emit("chat:error",{
        message:"You do not have the access to the Chat"})
        const message=await createMessage(socket?.user?._id,courseId,content);
        console.log("message",message);
        const courseRoom=`course:${courseId}`;
        io.to(courseRoom).emit("chat:message",message)
      } catch (error) {
        console.log("Chat Message Error: ",error);
        socket.emit("chat:error",{
          message:error.message || "Failed to send message"
        })
      }
    })

    // leave chat 
    socket.on("chat:leave", (courseId) => {
  const courseRoom = `course:${courseId}`;

  socket.leave(courseRoom);

  console.log(`👋 ${socket.user._id} left ${courseRoom}`);
});

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", socket.id, reason);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
