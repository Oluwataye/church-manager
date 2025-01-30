import { Home, Users, Calendar, Bell, DollarSign, Settings } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: Bell, label: "Announcements", path: "/announcements" },
  { icon: DollarSign, label: "Income", path: "/income" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className="flex items-center gap-4 px-4 py-3 text-white hover:bg-church-700 transition-colors w-full rounded-md"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-base font-medium">{item.label}</span>
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
};