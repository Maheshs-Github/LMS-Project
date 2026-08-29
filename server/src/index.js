import "./env.js";
import { connDB } from "../db/index.js";
import { app } from "./app.js";
import createDefaultAdmin from "../utils/createDefaultAdmin.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { initializeSocket } from "../socket/index.js";
import createNotification from "../services/notification.service.js";

connDB()
  .then(() => {
    console.log("DB is Connected Successfully ");
    createDefaultAdmin();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });

    initializeSocket(io);

    io.use(async (socket, next) => {
      try {
        console.log("Socket Authentication has been Started");
        const cookie = socket.handshake.headers.cookie;
        console.log("Socket Cookie: ", cookie);
        const accessToken = cookie
          .split(";")
          .find((item) => item.trim().startsWith("accessToken="))
          .split("=")[1];
        console.log("accessToken: ", accessToken);
        if (!accessToken) throw new ApiError("Unauthrized User");

        const decodedToken = await jwt.verify(
          accessToken,
          process.env.TOKEN_KEY,
        );

        console.log("decodedToken: ", decodedToken);

        const user = await User.findById(decodedToken?._id).select(
          "-password -createdAt -updatedAt -__v",
        );
        socket.user = user;
        next();
      } catch (error) {
        next(error);
      }
    });

    io.on("connection", (socket) => {
      console.log("Conncetion Established Successfuly", socket.id);
      console.log("Connected User:", socket?.user);

      const userRoom = `user:${socket?.user?._id}`;
      socket.join(userRoom);
      console.log("New Room: ", userRoom);
      socket.on("testRoom", () => {
        const userRoom = `user:${socket?.user?._id}`;
        io.to(userRoom).emit("userRoomMessage", {
          message: `Hello ${socket?.user?.name}`,
        });
      });

      socket.on("hello", (data) => {
        console.log("Message from Client is a : ", data);
      });
      socket.emit("hello2", { message: "Hai, backend desu, yorishuku" });
      socket.on("disconnect", () =>
        console.log("Conncetion Closed Successfully", socket.id),
      );

      socket.join(`test:${socket.id}`);
      console.log("Joined Room: ", `test:${socket.id}`);

      socket.on("hello3", () => {
        io.to(`test:${socket.id}`).emit("roomMessage", {
          message: "Hello from your Room",
        });
      });

      socket.on("testAck", (callback) => {
        console.log("testAck received");
        callback({
          success: true,
          message: "Hello from Server",
        });
      });

      socket.on("notification:test", async () => {
        try {
            console.log("🔥 notification:test received");
          await createNotification({
            recipient: socket.user._id,
            type: "general",
            title: "Test Notification",
            message: "Socket.IO notification is working!",
          });
        } catch (err) {
          console.log("Test Notication error: ",err);
        }
      });
    });

    httpServer.listen(process.env.PORT || 5000, () =>
      console.log(`Connected on the POrt ${process.env.PORT}`),
    );
  })
  .catch((err) =>
    console.log("THere is been some Error while connecting the DB: ", err),
  );
