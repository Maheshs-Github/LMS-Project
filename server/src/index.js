// import "./env.js";
// import { connDB } from "../db/index.js";
// import { connectRedis } from "../config/redis.js";
// import createDefaultAdmin from "../utils/createDefaultAdmin.js";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import { initializeSocket } from "../socket/index.js";

// connDB()
//   .then(async() => {
//     console.log("DB is Connected Successfully ");
//     connectRedis();
//         // Load app only after Redis is connected
//     const { app } = await import("./app.js");
//     createDefaultAdmin();
//     const httpServer = createServer(app);
//     const io = new Server(httpServer, {
//       cors: {
//         origin: "http://localhost:5173",
//         credentials: true,
//       },
//     });

//     initializeSocket(io);

//     httpServer.listen(process.env.PORT || 5000, () =>
//       console.log(`Connected on the POrt ${process.env.PORT}`),
//     );
//   })
//   .catch((err) =>
//     console.log("THere is been some Error while connecting the DB: ", err),
//   );


import "./env.js";
import { connDB } from "../db/index.js";
import { connectRedis } from "../config/redis.js";
import createDefaultAdmin from "../utils/createDefaultAdmin.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "../socket/index.js";

const startServer = async () => {
  try {
    // 1. Connect MongoDB
    await connDB();
    console.log("DB is connected successfully");

    // 2. Connect Redis
    await connectRedis();
    console.log("Redis is connected successfully");

    // 3. Load Express app
    const { app } = await import("./app.js");

    // 4. Create default admin
    await createDefaultAdmin();

    // 5. Create HTTP server
    const httpServer = createServer(app);

    // 6. Initialize Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });

    initializeSocket(io);

    // 7. Start server
    const PORT = process.env.PORT || 5000;

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);

    process.exit(1);
  }
};

startServer();