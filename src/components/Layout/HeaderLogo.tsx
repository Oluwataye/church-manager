
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchChurchSettings } from "@/services/churchSettings";
import { useEffect, useState } from "react";

export function HeaderLogo({ className = "" }: { className?: string }) {
  const [logoKey, setLogoKey] = useState<number>(0);
  const { data: settings, isLoading } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0,
    refetchInterval: 5000 // Refetch every 5 seconds to ensure logo is updated
  });

  // Force re-render when settings change
  useEffect(() => {
    if (settings?.logo_url) {
      console.log("HeaderLogo received new logo URL:", settings.logo_url);
      setLogoKey(prevKey => prevKey + 1);
    }
  }, [settings?.logo_url]);

  const avatarClassName = `h-16 w-16 md:h-24 md:w-24 ${className}`;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Avatar className={avatarClassName + " animate-pulse"}>
          <AvatarFallback>Logo</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center header-logo">
      <Avatar className={avatarClassName} id="header-logo-avatar">
        <AvatarImage 
          key={logoKey} // Force re-render when logo changes
          src={settings?.logo_url || "/placeholder.svg"} 
          alt="Church Logo" 
          className="header-logo-image"
        />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
    </div>
  );
}
