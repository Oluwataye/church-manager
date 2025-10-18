import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { uploadMemberPhoto } from "@/services/memberPhotoService";
import { useState } from "react";

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
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setIsUploading(true);
      try {
        const publicUrl = await uploadMemberPhoto(file);
        onPhotoChange(publicUrl);
        toast({
          title: "Success",
          description: "Photo uploaded successfully",
        });
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast({
          title: "Error",
          description: "Failed to upload photo. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
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
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
        </Button>
      </div>
    </div>
  );
}