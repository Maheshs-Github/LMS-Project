import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotifications, setNotifications } from "../redux/NotificationSlice";
import socket from "@/socket/socket";
import { useGet } from "@/hooks/useGet";

const SocketListener = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { data: notificationData, notificationError } = useGet(
    user ? "notification" : null,
  );

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket Connect: ", socket?.id);
    };
    const handleDisconnect = (reason) => {
      console.log("Socket Disconnceted: ", reason);
    };
    const handleError = (error) => {
      console.log("Error while connecting: ", error?.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
    };
  }, []);

  useEffect(() => {
    if (notificationData) dispatch(setNotifications(notificationData?.data));
  }, [notificationData, dispatch]);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [user]);

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
