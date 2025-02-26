
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
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // First upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('church-assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('church-assets')
      .getPublicUrl(filePath);

    // Update the church settings with the new logo URL
    const { error: updateError } = await supabase
      .from('church_settings')
      .update({ 
        logo_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('church_name', 'LIVING FAITH CHURCH')
      .select()
      .single();

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}

export function ChurchLogo({ displayOnly = false, onLogoChange, className = "" }: ChurchLogoProps) {
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 0, // This ensures we always get fresh data
  });

  const uploadMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: (publicUrl) => {
      // Invalidate and refetch church settings
      queryClient.invalidateQueries({ queryKey: ['churchSettings'] });
      
      // Update any parent components
      if (onLogoChange) {
        onLogoChange(publicUrl);
      }

      // Show success message
      toast({
        title: "Success!",
        description: "Church logo has been updated successfully",
      });

      // Reset the form
      setTempLogo(null);
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      // Show error message
      toast({
        title: "Error",
        description: `Failed to update logo: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Logo file size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
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
    toast({
      title: "Cancelled",
      description: "Logo update cancelled",
    });
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
