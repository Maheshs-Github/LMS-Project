
import { refreshSession } from "@/utils/apiClient";
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_BASE_BACKEND_SOCKET_URL,
  {
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
  }
);

let refreshingSocket = false;

socket.on("connect_error", async (error) => {
  if (error.message !== "Unauthorized User" || refreshingSocket) {
    return;
  }

  refreshingSocket = true;

  try {
    await refreshSession();

    // Reconnect with the newly issued HTTP-only cookie.
    socket.connect();
  } catch (refreshError) {
    console.error("Socket session refresh failed:", refreshError);
  } finally {
    refreshingSocket = false;
  }
});

export default socket;
