
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadLogo } from "@/services/churchSettings";
import { useOnlineStatus } from "./useOnlineStatus";
import { useAuth } from "@/components/Auth/AuthContext";
import { updateHeaderLogo } from "@/utils/logoEvents";
import { useOfflineLogoUpload } from "./useOfflineLogoUpload";
import { usePendingLogoUploads } from "./usePendingLogoUploads";
import { toast } from "@/hooks/use-toast";

export function useLogoUpload(onLogoChange?: (logo: string) => void) {
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isOffline } = useOnlineStatus();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { saveOfflineLogo } = useOfflineLogoUpload();

  // Set up the upload mutation
  const uploadMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: ({ publicUrl }) => {
      console.log("Logo upload success, URL:", publicUrl);
      
      // Immediately update the UI via event system
      updateHeaderLogo(publicUrl);
      
      // Also update via React Query for components using the hook
      queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
      
      queryClient.setQueryData(['churchSettings'], (old: any) => ({
        ...old,
        logo_url: publicUrl
      }));
      
      // Call callback if provided
      if (onLogoChange) {
        onLogoChange(publicUrl);
      }

      // Clear temporary state
      setTempLogo(null);
      setSelectedFile(null);
      
      toast({
        variant: "success",
        title: "Logo Updated",
        description: "Your new logo is now visible in the header"
      });
    },
    onError: (error: any) => {
      console.error("Logo upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
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
      toast({
        variant: "warning",
        title: "File Too Large",
        description: "Logo file size must be less than 5MB"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "warning",
        title: "Invalid File Type",
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
      toast({
        variant: "warning",
        title: "No Image Selected",
        description: "Please select an image first"
      });
      return;
    }
    
    // Immediately update UI regardless of online/offline status
    updateHeaderLogo(tempLogo);
    
    if (isOffline) {
      // Save for offline use and pending uploads
      console.log("Saving logo offline:", tempLogo.substring(0, 50) + "...");
      saveOfflineLogo(selectedFile, tempLogo);
      
      // Clear temporary state after saving
      setTempLogo(null);
      setSelectedFile(null);
      
      toast({
        variant: "success",
        title: "Logo Updated (Offline)",
        description: "Changes will be synced when you're back online"
      });
    } else {
      if (!user) {
        toast({
          variant: "warning",
          title: "Authentication Required",
          description: "You must be logged in to upload a logo"
        });
        return;
      }
      
      console.log("Uploading logo to server:", selectedFile.name);
      uploadMutation.mutate(selectedFile);
    }
  };

  /**
   * Cancel logo selection
   */
  const handleCancel = () => {
    setTempLogo(null);
    setSelectedFile(null);
    toast({
      variant: "info",
      title: "Cancelled",
      description: "Logo update cancelled"
    });
  };

  return {
    tempLogo,
    handleLogoUpload,
    handleApply, 
    handleCancel,
    isUploading: uploadMutation.isPending,
    isOffline,
    pendingUploads: 0 // This is now handled by usePendingLogoUploads
  };
}
