
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadLogo } from "@/services/churchSettings";

export function useLogoUpload(onLogoChange?: (logo: string) => void) {
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: ({ publicUrl }) => {
      console.log("Logo upload success, URL:", publicUrl);
      
      // Force a complete refresh of church settings data
      queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
      
      // Set data in the cache immediately for instant UI updates
      queryClient.setQueryData(['churchSettings'], (old: any) => ({
        ...old,
        logo_url: publicUrl
      }));
      
      // Update parent components
      if (onLogoChange) {
        onLogoChange(publicUrl);
      }

      // Update header logo
      updateHeaderLogo(publicUrl);

      // Reset form state
      setTempLogo(null);
      setSelectedFile(null);
      
      // Show success message
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

  const updateHeaderLogo = (logoUrl: string) => {
    // Find the header logo image
    const headerLogoImage = document.querySelector('#header-logo-avatar .header-logo-image');
    if (headerLogoImage instanceof HTMLImageElement) {
      console.log("Updating header logo image to:", logoUrl);
      headerLogoImage.src = logoUrl;
    }

    // If the above selector doesn't work, try this alternative approach
    const allHeaderImages = document.querySelectorAll('.header-logo img, .header-logo-container img, .header-logo-image');
    allHeaderImages.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        console.log("Updating header image to:", logoUrl);
        img.src = logoUrl;
      }
    });

    // Trigger a re-fetch of church settings
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
    }, 500); // Add a small delay to ensure the cache is updated
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Logo file size must be less than 5MB"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", {
        description: "Please select an image file"
      });
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);
    setSelectedFile(file);
    
    // Create preview of the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log("Image preview created");
      setTempLogo(result);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = async () => {
    if (!selectedFile) {
      toast.error("No image selected");
      return;
    }
    
    console.log("Uploading logo:", selectedFile.name);
    uploadMutation.mutate(selectedFile);
  };

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
    isUploading: uploadMutation.isPending
  };
}
