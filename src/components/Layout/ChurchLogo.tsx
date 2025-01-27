import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ChurchLogo() {
  const [logo, setLogo] = useState<string>("/placeholder.svg");
  const { toast } = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Logo file size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
        toast({
          title: "Success",
          description: "Church logo updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={logo} alt="Church Logo" />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <input
          type="file"
          id="logo-upload"
          className="hidden"
          accept="image/*"
          onChange={handleLogoUpload}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("logo-upload")?.click()}
        >
          Update Logo
        </Button>
      </div>
    </div>
  );
}