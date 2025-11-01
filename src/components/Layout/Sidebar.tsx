
import { Home, Users, Calendar, Bell, DollarSign, Settings, LogOut, ClipboardCheck } from "lucide-react";
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
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

const menuGroups = [
  {
    label: "Overview",
    items: [
      { icon: Home, label: "Dashboard", path: "/" },
    ]
  },
  {
    label: "Church Management",
    items: [
      { icon: Users, label: "Members", path: "/members" },
      { icon: ClipboardCheck, label: "Attendance", path: "/attendance" },
      { icon: Users, label: "Groups", path: "/groups" },
    ]
  },
  {
    label: "Finance & Events",
    items: [
      { icon: DollarSign, label: "Income", path: "/income" },
      { icon: Calendar, label: "Events", path: "/events" },
      { icon: Bell, label: "Announcements", path: "/announcements" },
    ]
  },
  {
    label: "Settings",
    items: [
      { icon: Settings, label: "Settings", path: "/settings" },
    ]
  }
];

export const AppSidebar = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error.message,
      });
    }
  };

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarContent>
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label}>
            {group.label && groupIndex > 0 && (
              <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider px-3 mb-2">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path || 
                    (item.path === "/" && location.pathname === "/dashboard");
                  
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild data-active={isActive}>
                        <Link 
                          to={item.path} 
                          className={`flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all rounded-md relative group ${
                            isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : ""
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                          )}
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all rounded-md w-full"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
