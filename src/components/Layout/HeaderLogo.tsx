
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchChurchSettings } from "@/services/churchSettings";
import { useEffect, useState, useRef } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function HeaderLogo({ className = "" }: { className?: string }) {
  const [logoKey, setLogoKey] = useState<number>(0);
  const [logoUrl, setLogoUrl] = useState<string>("/placeholder.svg");
  const { isOffline } = useOnlineStatus();
  const logoRef = useRef<HTMLImageElement>(null);
  
  // Check for offline logo in local storage on initial load
  useEffect(() => {
    const savedLogo = localStorage.getItem('offlineLogo');
    if (savedLogo) {
      console.log("HeaderLogo: Found offline logo in localStorage:", savedLogo);
      setLogoUrl(savedLogo);
      setLogoKey(prevKey => prevKey + 1);
    }
  }, []);

  // Listen for offline logo updates via localStorage events
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'offlineLogo' && event.newValue) {
        console.log("HeaderLogo: Storage event detected with new logo:", event.newValue);
        setLogoUrl(event.newValue);
        setLogoKey(prevKey => prevKey + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);
  
  // Listen for direct updates via custom event
  useEffect(() => {
    const handleLogoUpdatedEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.logoUrl) {
        console.log("HeaderLogo: Custom logoUpdated event detected:", customEvent.detail.logoUrl);
        setLogoUrl(customEvent.detail.logoUrl);
        setLogoKey(prevKey => prevKey + 1);
        
        // Also update the ref directly as an additional measure
        if (logoRef.current) {
          logoRef.current.src = customEvent.detail.logoUrl;
        }
      }
    };
    
    // Listen on both document and window for maximum compatibility
    document.addEventListener('logoUpdated', handleLogoUpdatedEvent);
    window.addEventListener('logoUpdated', handleLogoUpdatedEvent);
    
    return () => {
      document.removeEventListener('logoUpdated', handleLogoUpdatedEvent);
      window.removeEventListener('logoUpdated', handleLogoUpdatedEvent);
    };
  }, []);

  // Fetch church settings from server when online
  const { data: settings } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0,
    refetchInterval: 5000, // Refetch every 5 seconds to ensure logo is updated
    enabled: !isOffline // Only fetch from server when online
  });

  // Update logo when settings change
  useEffect(() => {
    if (settings?.logo_url) {
      console.log("HeaderLogo: Received new logo URL from settings:", settings.logo_url);
      setLogoUrl(settings.logo_url);
      localStorage.setItem('offlineLogo', settings.logo_url); // Save for offline use
      setLogoKey(prevKey => prevKey + 1);
    }
  }, [settings?.logo_url]);

  const avatarClassName = `h-16 w-16 md:h-24 md:w-24 ${className}`;
  
  if (!logoUrl) {
    return (
      <div className="flex items-center justify-center">
        <Avatar className={avatarClassName + " animate-pulse"}>
          <AvatarFallback>Logo</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  console.log("HeaderLogo rendering with logoUrl:", logoUrl, "key:", logoKey);

  return (
    <div className="flex flex-col items-center header-logo">
      <Avatar className={avatarClassName} id="header-logo-avatar">
        <AvatarImage 
          key={logoKey} // Force re-render when logo changes
          ref={logoRef}
          src={logoUrl} 
          alt="Church Logo" 
          className="header-logo-image"
          onError={() => {
            console.log("HeaderLogo: Image failed to load, falling back to placeholder");
            if (logoRef.current) {
              logoRef.current.src = "/placeholder.svg";
            }
          }}
        />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
    </div>
  );
}
