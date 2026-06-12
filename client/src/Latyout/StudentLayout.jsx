import Navbar from "@/components/Navbar";
import { AppSidebar } from "@/components/Sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import React from "react";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className=" w-full flex flex-col">

        {/* TOP NAVBAR */}
        <Navbar />
        <SidebarProvider>

        {/* SIDEBAR + CONTENT */}
        <div className="flex w-full">

          {/* SIDEBAR */}
          <AppSidebar role="student" />

          {/* PAGE CONTENT */}
          <main className="flex-1 p-4 w-full">

            {/* MOBILE SIDEBAR BUTTON */}
            <SidebarTrigger />

            {/* CURRENT PAGE */}
            <Outlet />

          </main>
        </div>
    </SidebarProvider>
      </div>
  );
};

export default StudentLayout;