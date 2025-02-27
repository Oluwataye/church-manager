
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
      // Immediately update the cache
      queryClient.setQueryData(['churchSettings'], (old: any) => ({
        ...old,
        logo_url: publicUrl
      }));
      
      // Then invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
      
      // Update parent components
      if (onLogoChange) {
        onLogoChange(publicUrl);
      }

      // Reset form state
      setTempLogo(null);
      setSelectedFile(null);
      
      // Show success message
      toast("Logo updated successfully", {
        description: "Your new logo is now visible in the header"
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update logo", {
        description: error.message
      });
    }
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
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
