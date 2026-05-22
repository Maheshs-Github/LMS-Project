import React, { useState } from "react";
import { LogOut, Moon, School, SunMedium } from "lucide-react";
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

const Navbar = () => {
  const [mode, setMode] = useState(true);
  return (
    <div className="flex items-center w-full border-b-2 p-2 justify-between px-28">
      <div className="flex gap-3 w-full">
        <School size={30} />
        <h1 className="font-bold text-2xl">E-Learning</h1>
      </div>
      <div className="flex w-full gap-3 items-center justify-end">
        <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline-none">
              {/* <img
                src={Frieren}
                alt="profile picture"
                className="h-9 w-9 rounded-full"
              /> */}
              <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
              <DropdownMenuItem>My Learning</DropdownMenuItem>
              <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem ><div className="flex gap-2 items-center text-red-700 w-full h-full"><span>Log out </span> <LogOut /></div></DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <button
          className="p-1 border outline-gray-500 rounded-xs cursor-pointer"
          onClick={() => setMode(!mode)}
        >
          {mode ? <SunMedium size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;

