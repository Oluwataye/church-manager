
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
  const { isOffline } = useOnlineStatus();
  const logoRef = useRef<HTMLImageElement>(null);
  
  // Load initial logo from localStorage
  useEffect(() => {
    const savedLogo = localStorage.getItem('offlineLogo');
    if (savedLogo) {
      console.log("ChurchLogo: Loading logo from localStorage");
      setLogoUrl(savedLogo);
      
      if (logoRef.current) {
        logoRef.current.src = savedLogo;
      }
      
      // Propagate change if callback provided
      if (onLogoChange) {
        onLogoChange(savedLogo);
      }
    }
  }, [onLogoChange]);
  
  // Listen for localStorage events
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'offlineLogo' && event.newValue) {
        console.log("ChurchLogo: Storage event with new logo");
        setLogoUrl(event.newValue);
        
        if (logoRef.current) {
          logoRef.current.src = event.newValue;
        }
        
        // Propagate change if callback provided
        if (onLogoChange) {
          onLogoChange(event.newValue);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [onLogoChange]);
  
  // Listen for custom logo update events
  useEffect(() => {
    const handleLogoUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.logoUrl) {
        console.log("ChurchLogo: Received custom logoUpdated event");
        const newLogoUrl = customEvent.detail.logoUrl;
        
        setLogoUrl(newLogoUrl);
        
        if (logoRef.current) {
          logoRef.current.src = newLogoUrl;
        }
        
        // Propagate change if callback provided
        if (onLogoChange) {
          onLogoChange(newLogoUrl);
        }
      }
    };
    
    document.addEventListener('logoUpdated', handleLogoUpdated);
    return () => document.removeEventListener('logoUpdated', handleLogoUpdated);
  }, [onLogoChange]);
  
  // Fetch settings from server when online
  const { data: settings } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0,
    enabled: !isOffline,
    gcTime: 0,
    onSuccess: (data) => {
      if (data?.logo_url) {
        console.log("ChurchLogo: New logo from server:", data.logo_url);
        setLogoUrl(data.logo_url);
        localStorage.setItem('offlineLogo', data.logo_url);
        
        if (logoRef.current) {
          logoRef.current.src = data.logo_url;
        }
        
        // Propagate change if callback provided
        if (onLogoChange) {
          onLogoChange(data.logo_url);
        }
      }
    }
  });

  const avatarClassName = `${displayOnly ? "h-16 w-16 md:h-24 md:w-24" : "h-24 w-24"} ${className}`;
  const currentLogoUrl = tempLogo || logoUrl || settings?.logo_url || "/placeholder.svg";

  return (
    <div className={`flex flex-col items-center ${!displayOnly ? "gap-4" : ""} ${displayOnly ? "header-logo" : ""}`}>
      <Avatar className={avatarClassName}>
        <AvatarImage 
          ref={logoRef}
          src={currentLogoUrl} 
          alt="Church Logo" 
          className="header-logo-image"
          onError={(e) => {
            console.log("ChurchLogo: Image failed to load, falling back to placeholder");
            const img = e.currentTarget;
            img.src = "/placeholder.svg";
          }}
        />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      {!displayOnly && <LogoEditor onLogoChange={onLogoChange} />}
    </div>
  );
}
