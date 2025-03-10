
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadLogo } from "@/services/churchSettings";
import { useOnlineStatus } from "./useOnlineStatus";
import { useAuth } from "@/components/Auth/AuthContext";
import { updateHeaderLogo } from "@/utils/logoEvents";
import { useOfflineLogoUpload } from "./useOfflineLogoUpload";
import { usePendingLogoUploads } from "./usePendingLogoUploads";

export function useLogoUpload(onLogoChange?: (logo: string) => void) {
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isOffline } = useOnlineStatus();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { pendingUploads, saveOfflineLogo } = useOfflineLogoUpload();

  // Set up the upload mutation
  const uploadMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: ({ publicUrl }) => {
      console.log("Logo upload success, URL:", publicUrl);
      
      queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
      
      queryClient.setQueryData(['churchSettings'], (old: any) => ({
        ...old,
        logo_url: publicUrl
      }));
      
      if (onLogoChange) {
        onLogoChange(publicUrl);
      }

      updateHeaderLogo(publicUrl);

      setTempLogo(null);
      setSelectedFile(null);
      
      toast("Logo updated successfully", {
        description: "Your new logo is now visible in the header"
      });
    },
    onError: (error: any) => {
      console.error("Logo upload error:", error);
      toast.error("Failed to update logo", {
        description: error.message || "An unexpected error occurred"
      });
    }
  });

  // Set up pending uploads processing
  usePendingLogoUploads(uploadMutation.mutateAsync);

  /**
   * Handle file selection from the input
   */
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Logo file size must be less than 5MB"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", {
        description: "Please select an image file"
      });
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log("Image preview created");
      setTempLogo(result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Apply the selected logo changes
   */
  const handleApply = async () => {
    if (!selectedFile || !tempLogo) {
      toast.error("No image selected");
      return;
    }
    
    if (isOffline) {
      saveOfflineLogo(selectedFile, tempLogo);
      setTempLogo(null);
      setSelectedFile(null);
    } else {
      if (!user) {
        toast.error("Authentication required", {
          description: "You must be logged in to upload a logo"
        });
        return;
      }
      
      console.log("Uploading logo:", selectedFile.name);
      uploadMutation.mutate(selectedFile);
    }
  };

  /**
   * Cancel logo selection
   */
  const handleCancel = () => {
    setTempLogo(null);
    setSelectedFile(null);
    toast("Logo update cancelled");
  };

  return {
    tempLogo,
    handleLogoUpload,
    handleApply, 
    handleCancel,
    isUploading: uploadMutation.isPending,
    isOffline,
    pendingUploads: pendingUploads.length
  };
}
