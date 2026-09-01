import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

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

    const userRoom = `user:${socket.user._id}`;

    socket.join(userRoom);

    console.log("Joined user room:", userRoom);

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
