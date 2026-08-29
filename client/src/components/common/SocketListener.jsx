import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { addNotifications } from "../../../redux/NotificationSlice";
import socket from "@/socket/socket";

const SocketListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNotification = (notification) => {
      console.log("🔔 New Notification:", notification);

      dispatch(addNotifications(notification));
    };

    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
    };
  }, [dispatch]);

  return null;
};

export default SocketListener;