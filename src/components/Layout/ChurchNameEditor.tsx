
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateChurchName } from "@/services/churchSettings";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface ChurchNameEditorProps {
  initialName?: string;
  onNameChange?: (name: string) => void;
}

export function ChurchNameEditor({ initialName = "LIVING FAITH CHURCH", onNameChange }: ChurchNameEditorProps) {
  const [churchName, setChurchName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { isOffline } = useOnlineStatus();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!churchName.trim()) {
      toast.error("Church name cannot be empty");
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (isOffline) {
        // In offline mode, just store locally
        localStorage.setItem("churchName", churchName);
        
        // Dispatch a custom event for updates
        const nameUpdatedEvent = new CustomEvent('churchNameUpdated', { 
          detail: { churchName } 
        });
        window.dispatchEvent(nameUpdatedEvent);
        
        toast.success("Church name updated locally");
      } else {
        // Online mode - update in database
        await updateChurchName(churchName);
        queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
        toast.success("Church name updated successfully");
      }
      
      if (onNameChange) {
        onNameChange(churchName);
      }
      
    } catch (error) {
      console.error("Error updating church name:", error);
      toast.error("Failed to update church name");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="church-name">Church Name</Label>
        <Input
          id="church-name"
          value={churchName}
          onChange={(e) => setChurchName(e.target.value)}
          placeholder="Enter your church name"
          className="w-full"
          maxLength={50}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading || churchName.trim() === initialName}
      >
        {isLoading ? "Updating..." : "Update Church Name"}
      </Button>
    </form>
  );
}
