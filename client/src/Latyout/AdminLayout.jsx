import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";

const AdminLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Navbar />
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar role="admin" />
          <main className="flex-1 flex flex-col w-full min-w-0">
            <div className="flex items-center px-4 py-2 md:hidden border-b border-border/40 bg-card/50">
              <SidebarTrigger className="cursor-pointer" />
              <span className="text-xs font-semibold text-muted-foreground ml-2">Admin Menu</span>
            </div>
            <div className="flex-1 p-2 sm:p-4 md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
