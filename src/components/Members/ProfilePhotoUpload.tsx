import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfilePhotoUploadProps {
  profilePhoto: string;
  familyName: string;
  onPhotoChange: (photo: string) => void;
}

export function ProfilePhotoUpload({
  profilePhoto,
  familyName,
  onPhotoChange,
}: ProfilePhotoUploadProps) {
  const { toast } = useToast();

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Profile photo must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profilePhoto || "/placeholder.svg"} alt="Profile Photo" />
        <AvatarFallback>{familyName?.[0] || "P"}</AvatarFallback>
      </Avatar>
      <div>
        <input
          type="file"
          id="profile-upload"
          className="hidden"
          accept="image/*"
          onChange={handleProfilePhotoUpload}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("profile-upload")?.click()}
        >
          Upload Photo
        </Button>
      </div>
    </div>
  );
}