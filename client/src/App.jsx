import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../redux/AuthSlice";
import { useGet } from "./hooks/useGet";
import AppRoutes from "./Routes/AppRoutes";
import { persistor } from "../store";

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
      {/* <h1 className='text-cyan-400 font-bold bg-amber-800'>Hello There , this is a LMS Projcet</h1>
      <Button>Let's go damn 🕊️</Button> */}

      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            <div className="h-screen flex mt-10 justify-center px-4">
              <Login />
            </div>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes> */}

      <AppRoutes />
    </div>
  );
};

export default App;
