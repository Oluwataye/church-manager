import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import churchLogoFull from '@/assets/church-logo-full.jpg';
import { uploadLogo } from '@/services/churchSettings';

export function LogoExtractor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedLogo, setExtractedLogo] = useState<string | null>(null);

  const handleExtractLogo = async () => {
    try {
      setIsProcessing(true);
      toast.info('Processing logo... This may take a moment.');

      // Load the church logo image
      const response = await fetch(churchLogoFull);
      const blob = await response.blob();
      const img = await loadImage(blob);

      // Remove background
      const processedBlob = await removeBackground(img);
      
      // Convert to File object
      const file = new File([processedBlob], 'church-logo.png', { type: 'image/png' });

      // Upload to storage
      const result = await uploadLogo(file);
      
      if (result.data?.logo_url) {
        setExtractedLogo(result.data.logo_url);
        
        // Store in localStorage
        localStorage.setItem('offlineLogo', result.data.logo_url);
        
        // Dispatch event to update logo everywhere
        const logoUpdatedEvent = new CustomEvent('logoUpdated', {
          detail: { logoUrl: result.data.logo_url }
        });
        window.dispatchEvent(logoUpdatedEvent);
        
        toast.success('Logo extracted and uploaded successfully!');
      }
    } catch (error) {
      console.error('Error extracting logo:', error);
      toast.error('Failed to extract logo. Please try uploading manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Extract the logo from the church image and remove its background
      </div>
      
      <Button
        onClick={handleExtractLogo}
        disabled={isProcessing}
        variant="outline"
      >
        {isProcessing ? 'Processing...' : 'Extract & Upload Logo'}
      </Button>

      {extractedLogo && (
        <div className="mt-4">
          <p className="text-sm text-green-600 mb-2">Logo extracted successfully!</p>
          <img 
            src={extractedLogo} 
            alt="Extracted logo" 
            className="max-w-xs border rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
