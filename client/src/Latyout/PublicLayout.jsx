import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

const PublicLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!isAuthPage && <Navbar />}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
