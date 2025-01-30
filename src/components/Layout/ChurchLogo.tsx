import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChurchLogoProps {
  displayOnly?: boolean;
  onLogoChange?: (logo: string) => void;
}

export function ChurchLogo({ displayOnly = false, onLogoChange }: ChurchLogoProps) {
  const [logo, setLogo] = useState<string>("/placeholder.svg");
  const [tempLogo, setTempLogo] = useState<string | null>(null);
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
        setTempLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (tempLogo) {
      setLogo(tempLogo);
      if (onLogoChange) {
        onLogoChange(tempLogo);
      }
      setTempLogo(null);
      toast({
        title: "Success",
        description: "Church logo updated successfully",
      });
    }
  };

  const handleCancel = () => {
    setTempLogo(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={tempLogo || logo} alt="Church Logo" />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      {!displayOnly && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              Choose Logo
            </Button>
          </div>
          {tempLogo && (
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={handleApply}
              >
                Apply Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}