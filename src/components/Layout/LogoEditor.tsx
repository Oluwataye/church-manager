
import { Button } from "@/components/ui/button";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { Loader2, Upload } from "lucide-react";

interface LogoEditorProps {
  onLogoChange?: (logo: string) => void;
}

export function LogoEditor({ onLogoChange }: LogoEditorProps) {
  const { 
    tempLogo, 
    handleLogoUpload, 
    handleApply, 
    handleCancel,
    isUploading
  } = useLogoUpload(onLogoChange);

  return (
    <div className="flex flex-col items-center gap-4">
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
              ) : "Apply Changes"}
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
