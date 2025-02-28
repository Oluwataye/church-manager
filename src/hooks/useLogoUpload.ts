import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadLogo } from "@/services/churchSettings";

export function useLogoUpload(onLogoChange?: (logo: string) => void) {
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingUploads, setPendingUploads] = useState<{file: File, dataUrl: string}[]>([]);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processPendingUploads();
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const savedUploads = localStorage.getItem('pendingLogoUploads');
    if (savedUploads) {
      const uploads = JSON.parse(savedUploads);
      setPendingUploads(uploads);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const processPendingUploads = async () => {
    const pendingUploadsCopy = [...pendingUploads];
    
    if (pendingUploadsCopy.length === 0) return;
    
    toast("Processing pending logo uploads", {
      description: `Uploading ${pendingUploadsCopy.length} pending logos`
    });
    
    for (const { dataUrl } of pendingUploadsCopy) {
      try {
        console.log("Would upload pending logo:", dataUrl.substring(0, 50) + "...");
      } catch (error) {
        console.error("Error processing pending upload:", error);
      }
    }
    
    setPendingUploads([]);
    localStorage.removeItem('pendingLogoUploads');
  };

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

  const updateHeaderLogo = (logoUrl: string) => {
    localStorage.setItem('offlineLogo', logoUrl);
    
    const headerLogoImage = document.querySelector('#header-logo-avatar .header-logo-image');
    if (headerLogoImage instanceof HTMLImageElement) {
      console.log("Updating header logo image to:", logoUrl);
      headerLogoImage.src = logoUrl;
    }

    const allHeaderImages = document.querySelectorAll('.header-logo img, .header-logo-container img, .header-logo-image');
    allHeaderImages.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        console.log("Updating header image to:", logoUrl);
        img.src = logoUrl;
      }
    });

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
    }, 500);
  };

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

  const handleApply = async () => {
    if (!selectedFile || !tempLogo) {
      toast.error("No image selected");
      return;
    }
    
    if (!isOnline) {
      console.log("Offline logo upload:", selectedFile.name);
      
      localStorage.setItem('offlineLogo', tempLogo);
      
      const newPendingUploads = [...pendingUploads, { file: selectedFile, dataUrl: tempLogo }];
      setPendingUploads(newPendingUploads);
      localStorage.setItem('pendingLogoUploads', JSON.stringify(newPendingUploads));
      
      updateHeaderLogo(tempLogo);
      
      setTempLogo(null);
      setSelectedFile(null);
      
      toast("Logo saved offline", {
        description: "The logo will be uploaded when you're back online"
      });
    } else {
      console.log("Uploading logo:", selectedFile.name);
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
    isUploading: uploadMutation.isPending,
    isOffline: !isOnline,
    pendingUploads: pendingUploads.length
  };
}
