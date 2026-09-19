import "./env.js";
import { connDB } from "../db/index.js";
import { app } from "./app.js";
import createDefaultAdmin from "../utils/createDefaultAdmin.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "../socket/index.js";
import { connectRedis } from "../config/redis.js";

connDB()
  .then(() => {
    console.log("DB is Connected Successfully ");
    connectRedis();
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
