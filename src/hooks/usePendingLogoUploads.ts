
import { useEffect } from "react";
import { toast } from "sonner";
import { useOfflineLogoUpload } from "./useOfflineLogoUpload";
import { useOnlineStatus } from "./useOnlineStatus";
import { uploadLogo } from "@/services/churchSettings";
import { useAuth } from "@/components/Auth/AuthContext";

export function usePendingLogoUploads(uploadMutationFn: (file: File) => Promise<any>) {
  const { pendingUploads, setPendingUploads } = useOfflineLogoUpload();
  const { isOffline } = useOnlineStatus();
  const { user } = useAuth();
  
  // Process pending uploads when coming back online
  useEffect(() => {
    const handleOnline = () => {
      processPendingUploads();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [pendingUploads]);
  
  /**
   * Process all pending uploads when coming back online
   */
  const processPendingUploads = async () => {
    if (isOffline || !user) return;
    
    const pendingUploadsCopy = [...pendingUploads];
    
    if (pendingUploadsCopy.length === 0) return;
    
    toast("Processing pending logo uploads", {
      description: `Uploading ${pendingUploadsCopy.length} pending logos`
    });
    
    for (const { file, dataUrl } of pendingUploadsCopy) {
      try {
        console.log("Uploading pending logo:", file.name);
        await uploadMutationFn(file);
      } catch (error) {
        console.error("Error processing pending upload:", error);
      }
    }
    
    setPendingUploads([]);
    localStorage.removeItem('pendingLogoUploads');
  };
  
  return {
    pendingUploads,
    processPendingUploads
  };
}
