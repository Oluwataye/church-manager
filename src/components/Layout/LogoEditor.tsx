
import { Button } from "@/components/ui/button";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { Loader2, Upload, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/Auth/AuthProvider";

interface LogoEditorProps {
  onLogoChange?: (logo: string) => void;
}

export function LogoEditor({ onLogoChange }: LogoEditorProps) {
  const { user } = useAuth();
  const { 
    tempLogo, 
    handleLogoUpload, 
    handleApply, 
    handleCancel,
    isUploading,
    isOffline,
    pendingUploads
  } = useLogoUpload(onLogoChange);

  return (
    <div className="flex flex-col items-center gap-4">
      {isOffline && (
        <div className="w-full mb-2">
          <Badge variant="outline" className="gap-1 bg-yellow-50 text-yellow-800 border-yellow-300 px-2 py-1 w-full flex justify-center">
            <WifiOff className="h-3.5 w-3.5 mr-1" />
            Offline Mode
          </Badge>
          {pendingUploads > 0 && (
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {pendingUploads} logo update{pendingUploads > 1 ? 's' : ''} pending
            </p>
          )}
        </div>
      )}
      
      {!user && (
        <Badge variant="outline" className="mb-2 w-full text-center py-1">
          Login required to save changes permanently
        </Badge>
      )}
      
      <input
        type="file"
        id="logo-upload"
        className="hidden"
        accept="image/*"
        onChange={handleLogoUpload}
      />
      
      {tempLogo ? (
        <div className="mt-4 w-full">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-2 mb-4">
            <img 
              src={tempLogo} 
              alt="Logo Preview" 
              className="max-h-40 mx-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Button
              variant="default"
              onClick={handleApply}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isOffline ? "Save Offline" : "Apply Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => document.getElementById("logo-upload")?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Logo
        </Button>
      )}
    </div>
  );
}
