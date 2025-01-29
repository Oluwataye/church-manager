import { ChurchLogo } from "@/components/Layout/ChurchLogo";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your church settings and preferences.
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Church Logo</h3>
          <p className="text-sm text-muted-foreground">
            Update your church logo. This will be used across the application.
          </p>
          <div className="mt-4">
            <ChurchLogo />
          </div>
        </div>
      </div>
    </div>
  );
}