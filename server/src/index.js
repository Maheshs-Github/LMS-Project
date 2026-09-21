import "./env.js";
import { connDB } from "../db/index.js";
import { connectRedis } from "../config/redis.js";
import createDefaultAdmin from "../utils/createDefaultAdmin.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "../socket/index.js";

connDB()
  .then(async() => {
    console.log("DB is Connected Successfully ");
    connectRedis();
        // Load app only after Redis is connected
    const { app } = await import("./app.js");
    createDefaultAdmin();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });

    initializeSocket(io);

    httpServer.listen(process.env.PORT || 5000, () =>
      console.log(`Connected on the POrt ${process.env.PORT}`),
    );
  })
  .catch((err) =>
    console.log("THere is been some Error while connecting the DB: ", err),
  );
