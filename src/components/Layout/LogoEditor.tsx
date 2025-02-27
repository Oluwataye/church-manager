
import { Button } from "@/components/ui/button";
import { useLogoUpload } from "@/hooks/useLogoUpload";

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
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Apply Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
