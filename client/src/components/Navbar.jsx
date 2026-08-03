import React, { useEffect, useState } from "react";
import Frieren from "../assets/FrierenSama.jpg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Link, useNavigate } from "react-router-dom";
import Icons from "@/utils/Icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/AuthSlice";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { persistor } from "../../store";

const Navbar = () => {
  const { mutate } = useMutation();
  const user = useSelector((state) => state.auth.user);
  const Dispatch = useDispatch();

  const navigate = useNavigate();
  const [mode, setMode] = useState(true);
  // useEffect(() => console.log("user: ", user), [user]);

  const userPicFallBack = user?.name
    .split(" ")
    .map((name) => name[0].toUpperCase())
    .join("");

  const handleLogOut = async() => {
    try {
      const res = await mutate({
        url: `user/logout`,
        method: "post",
      });
      persistor.purge();
      toast.success(res?.message || "Logged Out Successfully");
      Dispatch(logout());
      navigate("/auth");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error.message || "Error while Logging Out");
    }
  };
  const handlelogInRegisterAction = () => {
    navigate("/auth");
  };
  return (
    <div className="flex items-center w-full border-b-2 p-2 justify-between px-28">
      <button className="flex gap-3 w-full" onClick={() => navigate("/")}>
        <Icons.School size={30} />
        <Link className="font-bold text-2xl" to={"/"}>E-Learning</Link>
      </button>
      <div className="flex w-full gap-3 items-center justify-end">
        {user ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline-none " className={"border-0 p-0"}>
                  {/* <img
                src={Frieren}.
                alt="profile picture"
                className="h-9 w-9 rounded-full"
              /> */}
                  <Avatar>
                    <AvatarImage src={user?.photoUrl} alt="shadcn" />
                    <AvatarFallback>{userPicFallBack}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link to={`/${user?.role}/dashboard`}>Dashboard</Link>
                  </DropdownMenuItem>
                  {user?.role==="student"? <><DropdownMenuItem>
                    <Link to={"/student/my-learning"}> My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={"/student/profile"}> Edit Profile</Link>
                  </DropdownMenuItem></>:null}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <button
                      className="flex gap-2 items-center text-red-700 w-full h-full"
                      onClick={handleLogOut}
                    >
                      <span>Log out </span> <Icons.LogOut />
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <button
            onClick={handlelogInRegisterAction}
            className="px-5 py-2 rounded-md border border-gray-600 bg-black text-white font-medium hover:border-purple-500 hover:bg-gray-600 transition-all duration-200 cursor-pointer"
          >
            Login / Register
          </button>
        )}
        <button
          className="p-1 border outline-gray-500 rounded-xs cursor-pointer"
          onClick={() => setMode(!mode)}
        >
          {mode ? <Icons.SunMedium size={24} /> : <Icons.Moon size={24} />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
