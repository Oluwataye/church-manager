import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebar } from "./context"
import { SidebarMenuButtonProps } from "./types"
import { sidebarMenuButtonVariants } from "./variants"

export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"

export const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((props, ref) => {
  return <div ref={ref} {...props} />;
});
Sidebar.displayName = "Sidebar";

export const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarContent.displayName = "SidebarContent";

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarMenu = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(sidebarMenuButtonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>((props, ref) => {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"