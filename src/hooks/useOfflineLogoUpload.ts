
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateHeaderLogo } from "@/utils/logoEvents";

export function useOfflineLogoUpload() {
  const [pendingUploads, setPendingUploads] = useState<{file: File, dataUrl: string}[]>([]);
  
  // Load any saved pending uploads on mount
  useEffect(() => {
    const savedUploads = localStorage.getItem('pendingLogoUploads');
    if (savedUploads) {
      try {
        const uploads = JSON.parse(savedUploads);
        setPendingUploads(uploads);
      } catch (error) {
        console.error('Error parsing pending uploads:', error);
        localStorage.removeItem('pendingLogoUploads');
      }
    }
  }, []);
  
  /**
   * Save a logo for offline usage and add to pending uploads
   */
  const saveOfflineLogo = (file: File, dataUrl: string) => {
    console.log("Offline logo upload:", file.name);
    
    // Save for offline display
    localStorage.setItem('offlineLogo', dataUrl);
    
    // Add to pending uploads for when we're back online
    const newPendingUploads = [...pendingUploads, { file, dataUrl }];
    setPendingUploads(newPendingUploads);
    
    try {
      localStorage.setItem('pendingLogoUploads', JSON.stringify(newPendingUploads));
    } catch (error) {
      console.error('Error saving pending uploads:', error);
    }
    
    // Update display right away using the custom event
    updateHeaderLogo(dataUrl);
    
    toast("Logo saved offline", {
      description: "The logo will be uploaded when you're back online"
    });
    
    return newPendingUploads;
  };
  
  /**
   * Get the current offline logo from local storage
   */
  const getOfflineLogo = (): string | null => {
    return localStorage.getItem('offlineLogo');
  };
  
  return {
    pendingUploads,
    setPendingUploads,
    saveOfflineLogo,
    getOfflineLogo
  };
}
