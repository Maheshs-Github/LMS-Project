import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import Login from "./pages/LoginSignUp";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./components/student/Profile";

const App = () => {

  const loadUser = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}user/me`,
      {
        withCredentials: true,
      }
    );

    dispatch(setUser(res.data.user));

  } catch (error) {
    dispatch(logout());
  }
};

 useEffect(() => {
    loadUser();
  }, []);
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            <div className="h-screen flex mt-10 justify-center px-4">
              <Login />
            </div>
          }
        />
        {/* <Route
          path="/signup"
          element={
            <div className="h-screen flex mt-10 justify-center px-4">
              <SignUp />
            </div>
          }
        /> */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
