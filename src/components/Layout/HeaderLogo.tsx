import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchChurchSettings } from "@/services/churchSettings";
import { useEffect, useState, useRef } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toast } from "sonner";

export function HeaderLogo({ className = "" }: { className?: string }) {
  const [logoUrl, setLogoUrl] = useState<string>("/placeholder.svg");
  const { isOffline } = useOnlineStatus();
  const logoRef = useRef<HTMLImageElement>(null);
  
  // Load initial logo from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('offlineLogo');
    if (savedLogo) {
      console.log("HeaderLogo: Loading logo from localStorage");
      setLogoUrl(savedLogo);
      
      // Ensure the ref is updated too
      if (logoRef.current) {
        logoRef.current.src = savedLogo;
      }
    }
  }, []);

  // Listen for localStorage changes (works across tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'offlineLogo' && event.newValue) {
        console.log("HeaderLogo: Storage event with new logo");
        setLogoUrl(event.newValue);
        
        // Update ref directly
        if (logoRef.current) {
          logoRef.current.src = event.newValue;
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Listen for custom logoUpdated events
  useEffect(() => {
    const handleLogoUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.logoUrl) {
        console.log("HeaderLogo: Received custom logoUpdated event");
        const newLogoUrl = customEvent.detail.logoUrl;
        
        // Update state
        setLogoUrl(newLogoUrl);
        
        // Update ref directly for immediate visual feedback
        if (logoRef.current) {
          logoRef.current.src = newLogoUrl;
        }
      }
    };
    
    document.addEventListener('logoUpdated', handleLogoUpdated);
    return () => document.removeEventListener('logoUpdated', handleLogoUpdated);
  }, []);

  // Fetch logo from server (when online)
  const { data: settings } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0,
    enabled: !isOffline,
    gcTime: 0,
    meta: {
      onSuccess: (data) => {
        if (data?.logo_url) {
          console.log("HeaderLogo: New logo from server:", data.logo_url);
          setLogoUrl(data.logo_url);
          localStorage.setItem('offlineLogo', data.logo_url);
          
          // Update ref directly
          if (logoRef.current) {
            logoRef.current.src = data.logo_url;
          }
        }
      },
      onError: (error) => {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load logo from server");
      }
    }
  });

  const avatarClassName = `h-16 w-16 md:h-24 md:w-24 ${className}`;
  
  return (
    <div className="flex flex-col items-center header-logo" id="header-logo-container">
      <Avatar className={avatarClassName} id="header-logo-avatar">
        <AvatarImage 
          ref={logoRef}
          src={logoUrl} 
          alt="Church Logo" 
          className="header-logo-image"
          onError={(e) => {
            console.log("HeaderLogo: Image failed to load, falling back to placeholder");
            const img = e.currentTarget;
            img.src = "/placeholder.svg";
          }}
        />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
    </div>
  );
}
