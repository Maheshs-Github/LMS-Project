import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../redux/AuthSlice";
import { useGet } from "./hooks/useGet";
import AppRoutes from "./Routes/AppRoutes";
import { persistor } from "../store";
import socket from "./socket/socket.js"

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, error } = useGet(user ? "user/me" : null);

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

  useEffect(() => {
  if (user && data?.data?.User) {
    dispatch(setUser(data.data.User));
  }
}, [data, dispatch]);

useEffect(() => {
  if (error?.status === 401) {
    dispatch(logout());
    persistor.purge();
    navigate("/auth", { replace: true });
  }
}, [error, dispatch, navigate]);

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
