
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchChurchSettings } from "@/services/churchSettings";
import { LogoEditor } from "./LogoEditor";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { useEffect, useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useAuth } from "@/components/Auth/AuthContext";

interface ChurchLogoProps {
  displayOnly?: boolean;
  onLogoChange?: (logo: string) => void;
  className?: string;
}

export function ChurchLogo({ displayOnly = false, onLogoChange, className = "" }: ChurchLogoProps) {
  const { tempLogo } = useLogoUpload(onLogoChange);
  const [offlineLogo, setOfflineLogo] = useState<string | null>(null);
  const { isOffline } = useOnlineStatus();
  
  // Listen for changes to offline logo
  useEffect(() => {
    const savedLogo = localStorage.getItem('offlineLogo');
    if (savedLogo) {
      setOfflineLogo(savedLogo);
    }
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'offlineLogo' && event.newValue) {
        setOfflineLogo(event.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for direct updates
    const handleLogoUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.logoUrl) {
        setOfflineLogo(event.detail.logoUrl);
        if (onLogoChange) {
          onLogoChange(event.detail.logoUrl);
        }
      }
    };
    
    window.addEventListener('logoUpdated', handleLogoUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logoUpdated', handleLogoUpdate as EventListener);
    };
  }, [onLogoChange]);
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0,
    enabled: !isOffline
  });

  const avatarClassName = `${displayOnly ? "h-16 w-16 md:h-24 md:w-24" : "h-24 w-24"} ${className}`;
  const logoUrl = tempLogo || (isOffline ? offlineLogo : settings?.logo_url) || offlineLogo || "/placeholder.svg";

  console.log("ChurchLogo rendering with URL:", logoUrl);

  if (isLoading && !isOffline && !offlineLogo) {
    return (
      <div className="flex items-center justify-center">
        <Avatar className={avatarClassName + " animate-pulse"}>
          <AvatarFallback>Logo</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${!displayOnly ? "gap-4" : ""} ${displayOnly ? "header-logo" : ""}`}>
      <Avatar className={avatarClassName}>
        <AvatarImage src={logoUrl} alt="Church Logo" />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      {!displayOnly && <LogoEditor onLogoChange={onLogoChange} />}
    </div>
  );
}
