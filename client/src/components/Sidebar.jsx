import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { AdminItems, InstructorItems, StudentItems } from "@/resources/Data";
import Icons from "@/utils/Icons";

export function AppSidebar({ role = "student" }) {
  const location = useLocation();

  const itemKey = {
    admin: AdminItems,
    student: StudentItems,
    instructor: InstructorItems,
  };

  const roleTitles = {
    admin: "Admin Console",
    student: "Student Portal",
    instructor: "Instructor Studio",
  };

  const items = itemKey[role] || [];

  return (
    <Sidebar className="border-r border-border/60 bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-sm">
            ∞
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-sidebar-foreground">
              Infinity LMS
            </span>
            <span className="text-[10px] font-medium text-sidebar-foreground/60 capitalize">
              {roleTitles[role] || `${role} Portal`}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase px-2 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`h-10 text-sm font-medium rounded-lg transition-colors px-3 ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        {Icon && <Icon className="w-4 h-4 shrink-0" />}
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
