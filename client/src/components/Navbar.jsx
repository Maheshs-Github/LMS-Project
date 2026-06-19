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
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  
  const navigate = useNavigate();
  const [mode, setMode] = useState(true);
  useEffect(()=>console.log("user: ",user),[user])

  const userPicFallBack=user?.name.split(" ").map((name)=>name[0].toUpperCase()).join("")
  return (
    <div className="flex items-center w-full border-b-2 p-2 justify-between px-28">
      <div className="flex gap-3 w-full">
        <Icons.School size={30} />
        <h1 className="font-bold text-2xl">E-Learning</h1>
      </div>
      <div className="flex w-full gap-3 items-center justify-end">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline-none " className={"border-0 p-0"}>
                {/* <img
                src={Frieren}
                alt="profile picture"
                className="h-9 w-9 rounded-full"
              /> */}
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl}
                    alt="shadcn"
                  />
                  <AvatarFallback>{userPicFallBack}</AvatarFallback>
                  {console.log("userPicFallBack: ",userPicFallBack)}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                <DropdownMenuItem><Link to={`/${user?.role}/dashboard`}>Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem><Link to={"/student/my-learning"}>  My Learning</Link></DropdownMenuItem>
                <DropdownMenuItem><Link to={"/student/profile"}> Edit Profile</Link></DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div className="flex gap-2 items-center text-red-700 w-full h-full">
                    <span>Log out </span> <Icons.LogOut />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
