import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


import { Link, useLocation } from "react-router-dom";
import { AdminItems,InstructorItems,StudentItems } from "@/resources/Data";

export function AppSidebar({role="student"}) {
  const location = useLocation();

  const itemKey={
  admin:AdminItems,
  student:StudentItems,
  instructor:InstructorItems,
}


const items=itemKey[role] || [];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={location.pathname === item.url}
                    className="text-lg py-6"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
