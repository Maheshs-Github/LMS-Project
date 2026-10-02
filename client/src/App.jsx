import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "./redux/AuthSlice";
import { useGet } from "./hooks/useGet";
import AppRoutes from "./Routes/AppRoutes";
import { persistor } from "./store";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { data, error } = useGet(user ? "user/me" : null);

  useEffect(() => {
    if (user && data?.data?.User) {
      dispatch(setUser(data.data.User));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (user && error?.status === 401) {
      dispatch(logout());
      persistor.purge();
    }
  }, [error, user, dispatch]);

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
