
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchChurchSettings } from "@/services/churchSettings";

export function HeaderLogo({ className = "" }: { className?: string }) {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0,
  });

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
          src={settings?.logo_url || "/placeholder.svg"} 
          alt="Church Logo" 
          className="header-logo-image"
        />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
    </div>
  );
}
