import { useState } from "react";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [globalLogo, setGlobalLogo] = useState<string>("/placeholder.svg");

  const handleLogoChange = (newLogo: string) => {
    setGlobalLogo(newLogo);
    // Here you could implement persistence logic if needed
    localStorage.setItem("churchLogo", newLogo);
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
              The logo should be less than 5MB in size.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChurchLogo onLogoChange={handleLogoChange} />
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <Card>
          <CardHeader>
            <CardTitle>Other Settings</CardTitle>
            <CardDescription>
              Additional church settings and configurations will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No additional settings available at this time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}