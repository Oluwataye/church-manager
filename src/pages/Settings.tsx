
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogoChange = (newLogo: string) => {
    console.log("Logo changed in Settings:", newLogo);
    
    // Force a refresh of the church settings data
    queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
    
    // Update all header logo images
    const headerLogoImage = document.querySelector('#header-logo-avatar .header-logo-image');
    if (headerLogoImage instanceof HTMLImageElement) {
      console.log("Updating header logo image to:", newLogo);
      headerLogoImage.src = newLogo;
    }

    // Backup approach
    const allHeaderImages = document.querySelectorAll('.header-logo img, .header-logo-container img, .header-logo-image');
    allHeaderImages.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        console.log("Updating header image to:", newLogo);
        img.src = newLogo;
      }
    });
  };

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    toast("Theme updated", {
      description: `Theme changed to ${newTheme} mode`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your church settings and preferences.
        </p>
      </div>
      
      {!isOnline && (
        <Alert variant="warning" className="mb-4">
          <AlertTitle>Offline Mode</AlertTitle>
          <AlertDescription>
            You are currently offline. Logo uploads will not work until you have an internet connection.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Church Logo</CardTitle>
            <CardDescription>
              Update your church logo. This will be used across the application.
              Supported formats: PNG, JPEG, SVG. Maximum size: 5MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChurchLogo onLogoChange={handleLogoChange} />
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the appearance of your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={handleThemeChange} className="bg-gray-950 hover:bg-gray-800" />
              <Label htmlFor="theme-toggle">Dark Mode</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your security settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Password management and security features will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
