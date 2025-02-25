
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ChurchLogoProps {
  displayOnly?: boolean;
  onLogoChange?: (logo: string) => void;
  className?: string;
}

async function fetchChurchSettings() {
  const { data, error } = await supabase
    .from('church_settings')
    .select('logo_url')
    .single();
  
  if (error) throw error;
  return data;
}

async function uploadLogo(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('church-assets')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('church-assets')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('church_settings')
    .update({ 
      logo_url: publicUrl,
      updated_at: new Date().toISOString()
    })
    .eq('church_name', 'LIVING FAITH CHURCH');

  if (updateError) throw updateError;

  return publicUrl;
}

export function ChurchLogo({ displayOnly = false, onLogoChange, className = "" }: ChurchLogoProps) {
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings
  });

  const uploadMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: (publicUrl) => {
      queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
      if (onLogoChange) {
        onLogoChange(publicUrl);
      }
      toast({
        title: "Success",
        description: "Church logo updated successfully",
      });
      setTempLogo(null);
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Logo file size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleCancel = () => {
    setTempLogo(null);
    setSelectedFile(null);
  };

  const avatarClassName = `${displayOnly ? "h-16 w-16 md:h-24 md:w-24" : "h-24 w-24"} ${className}`;

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
    <div className={`flex flex-col items-center ${!displayOnly ? "gap-4" : ""}`}>
      <Avatar className={avatarClassName}>
        <AvatarImage src={tempLogo || settings?.logo_url || "/placeholder.svg"} alt="Church Logo" />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      {!displayOnly && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              Choose Logo
            </Button>
          </div>
          {tempLogo && (
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={handleApply}
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "Uploading..." : "Apply Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={uploadMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
