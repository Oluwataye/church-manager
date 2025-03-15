
/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    isElectron: boolean;
    apiBaseUrl: string;
    uploadFile: (options: { fileType: string }) => Promise<{
      success: boolean;
      file?: {
        name: string;
        path: string;
        url: string;
      };
      message?: string;
    }>;
  };
}
