
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchChurchSettings } from "@/services/churchSettings";
import { LogoEditor } from "./LogoEditor";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { useEffect, useState } from "react";

interface ChurchLogoProps {
  displayOnly?: boolean;
  onLogoChange?: (logo: string) => void;
  className?: string;
}

export function ChurchLogo({ displayOnly = false, onLogoChange, className = "" }: ChurchLogoProps) {
  const { tempLogo } = useLogoUpload(onLogoChange);
  const [offlineLogo, setOfflineLogo] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check for offline logo
  useEffect(() => {
    const savedLogo = localStorage.getItem('offlineLogo');
    if (savedLogo) {
      setOfflineLogo(savedLogo);
    }
  }, []);
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0,
    enabled: isOnline
  });

  const avatarClassName = `${displayOnly ? "h-16 w-16 md:h-24 md:w-24" : "h-24 w-24"} ${className}`;
  const logoUrl = tempLogo || (!isOnline ? offlineLogo : settings?.logo_url) || offlineLogo || "/placeholder.svg";

  console.log("ChurchLogo rendering with URL:", logoUrl);

  if (isLoading && isOnline && !offlineLogo) {
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
