import { useState } from "react";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [globalLogo, setGlobalLogo] = useState<string>("/placeholder.svg");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleLogoChange = (newLogo: string) => {
    setGlobalLogo(newLogo);
    // Here you would typically upload to backend
    localStorage.setItem("churchLogo", newLogo);
    toast({
      title: "Success",
      description: "Church logo updated successfully",
    });
  };

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${newTheme} mode`,
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
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Church Logo</CardTitle>
            <CardDescription>
              Update your church logo. This will be used across the application.
              Supported formats: PNG, JPEG, SVG. Maximum size: 2MB.
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
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={handleThemeChange}
              />
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
              Password management and security features will be available after connecting to Supabase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}