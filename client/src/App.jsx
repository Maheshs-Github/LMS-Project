import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../redux/AuthSlice";
import { useGet } from "./hooks/useGet";
import AppRoutes from "./Routes/AppRoutes";
import { persistor } from "../store";
import socket from "./socket/socket.js"
import { addNotifications, setNotifications } from "../redux/NotificationSlice";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, error } = useGet(user ? "user/me" : null);
  const {data:notificationData,notificationError}=useGet(user? "notification":null)

  // useEffect(() => {
  //   if (data?.data?.User) {
  //     dispatch(setUser(data?.data?.User));
  //   }
  //   if (error?.status === 401 && user) {
  //     dispatch(logout());
  //     persistor.purge();
  //     navigate("/auth");
  //   }
  // }, [data, error, user]);

  useEffect(()=>console.log("notificationData: ",notificationData),[notificationData])

  useEffect(()=>{
    const handleConnect=()=>{
      console.log("Socket Connect: ",socket?.id)
    }
    const handleDisconnect=(reason)=>{
      console.log("Socket Disconnceted: ",reason)
    }
    const handleError=(error)=>{
      console.log("Error while connecting: ",error?.message);
    }

    socket.on("connect",handleConnect);
    socket.on("disconnect",handleDisconnect);
    socket.on("connect_error",handleError);

    return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("connect_error", handleError);
  };
  },[])

  useEffect(() => {
  if (user && data?.data?.User) {
    dispatch(setUser(data.data.User));
  }
}, [data, dispatch]);

useEffect(()=>{
  if(notificationData)
    dispatch(setNotifications(notificationData?.data))
},[notificationData,dispatch])

useEffect(() => {
  if (error?.status === 401) {
    dispatch(logout());
    persistor.purge();
    navigate("/auth", { replace: true });
  }
}, [error, dispatch, navigate]);

useEffect(()=>{
  if(!user)
  {
    socket.disconnect();
    return;
  }
  socket.connect();

  return()=>{
    socket.disconnect();
  }
},[user])

useEffect(() => {
  const handleNotification = (notification) => {
    dispatch(addNotifications(notification));
  };

  socket.on("notification:new", handleNotification);

  return () => {
    socket.off("notification:new", handleNotification);
  };
}, [dispatch]);

  return (
    <div>
      <Toaster
        position="top-center"
        containerStyle={{
          margin: "60px", // or padding: '40px'
        }}
        // reverseOrder={false}
      />

      <AppRoutes />
    </div>
  );
};

export default App;
