import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";

const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <SidebarProvider>
        {/* SIDEBAR + CONTENT */}
        <div className="flex w-full">
          {/* SIDEBAR */}
          <AppSidebar role={"admin"} />

          {/* PAGE CONTENT */}
          <main className="flex-1 p-4 ">
            {/* MOBILE SIDEBAR BUTTON */}
            <SidebarTrigger />

            {/* CURRENT PAGE */}
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AdminLayout;
