
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchChurchSettings } from "@/services/churchSettings";
import { LogoEditor } from "./LogoEditor";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { useEffect, useState, useRef } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useAuth } from "@/components/Auth/AuthContext";

interface ChurchLogoProps {
  displayOnly?: boolean;
  onLogoChange?: (logo: string) => void;
  className?: string;
}

export function ChurchLogo({ displayOnly = false, onLogoChange, className = "" }: ChurchLogoProps) {
  const { tempLogo } = useLogoUpload(onLogoChange);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoKey, setLogoKey] = useState<number>(0);
  const { isOffline } = useOnlineStatus();
  const logoRef = useRef<HTMLImageElement>(null);
  
  // Check for offline logo in local storage
  useEffect(() => {
    const savedLogo = localStorage.getItem('offlineLogo');
    if (savedLogo) {
      console.log("ChurchLogo: Found offline logo in localStorage");
      setLogoUrl(savedLogo);
      setLogoKey(prevKey => prevKey + 1);
    }
  }, []);
  
  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'offlineLogo' && event.newValue) {
        console.log("ChurchLogo: Storage event with new logo:", event.newValue.substring(0, 50) + "...");
        setLogoUrl(event.newValue);
        setLogoKey(prevKey => prevKey + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Listen for custom logo update events
  useEffect(() => {
    const handleLogoUpdatedEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.logoUrl) {
        console.log("ChurchLogo: Custom event with new logo:", customEvent.detail.logoUrl.substring(0, 50) + "...");
        setLogoUrl(customEvent.detail.logoUrl);
        setLogoKey(prevKey => prevKey + 1);
        
        // Update ref directly too
        if (logoRef.current) {
          logoRef.current.src = customEvent.detail.logoUrl;
        }
        
        // Propagate the change if callback provided
        if (onLogoChange) {
          onLogoChange(customEvent.detail.logoUrl);
        }
      }
    };
    
    document.addEventListener('logoUpdated', handleLogoUpdatedEvent);
    window.addEventListener('logoUpdated', handleLogoUpdatedEvent);
    
    return () => {
      document.removeEventListener('logoUpdated', handleLogoUpdatedEvent);
      window.removeEventListener('logoUpdated', handleLogoUpdatedEvent);
    };
  }, [onLogoChange]);
  
  // Fetch settings from server when online
  const { data: settings } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0,
    enabled: !isOffline
  });

  // Update from settings when they change
  useEffect(() => {
    if (settings?.logo_url) {
      console.log("ChurchLogo: Received new logo from settings:", settings.logo_url);
      setLogoUrl(settings.logo_url);
      localStorage.setItem('offlineLogo', settings.logo_url);
      setLogoKey(prevKey => prevKey + 1);
    }
  }, [settings?.logo_url]);

  const avatarClassName = `${displayOnly ? "h-16 w-16 md:h-24 md:w-24" : "h-24 w-24"} ${className}`;
  const currentLogoUrl = tempLogo || logoUrl || settings?.logo_url || "/placeholder.svg";

  console.log("ChurchLogo rendering with URL:", currentLogoUrl);

  return (
    <div className={`flex flex-col items-center ${!displayOnly ? "gap-4" : ""} ${displayOnly ? "header-logo" : ""}`}>
      <Avatar className={avatarClassName}>
        <AvatarImage 
          key={logoKey}
          ref={logoRef}
          src={currentLogoUrl} 
          alt="Church Logo" 
          className="header-logo-image"
          onError={() => {
            console.log("ChurchLogo: Image failed to load, falling back to placeholder");
            if (logoRef.current) {
              logoRef.current.src = "/placeholder.svg";
            }
          }}
        />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      {!displayOnly && <LogoEditor onLogoChange={onLogoChange} />}
    </div>
  );
}
