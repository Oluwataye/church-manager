
/**
 * Utility functions for handling logo update events across components
 */

// Define a custom event for logo updates
export interface LogoUpdatedEvent extends CustomEvent {
  detail: { logoUrl: string };
}

/**
 * Dispatches a custom event to notify all components about a logo update
 */
export function dispatchLogoUpdatedEvent(logoUrl: string): void {
  // Create a proper custom event with the logoUrl in the detail
  const logoUpdatedEvent = new CustomEvent('logoUpdated', {
    detail: { logoUrl },
    bubbles: true, // Allow event to bubble up through the DOM
    cancelable: false
  }) as LogoUpdatedEvent;
  
  console.log("Dispatching logoUpdated event with URL:", logoUrl);
  
  // Dispatch at document level for maximum compatibility
  document.dispatchEvent(logoUpdatedEvent);
  
  // Store in localStorage for persistence and cross-tab updates
  localStorage.setItem('offlineLogo', logoUrl);
}

/**
 * Updates the logo in local storage and the DOM
 */
export function updateHeaderLogo(logoUrl: string): void {
  console.log("updateHeaderLogo called with URL:", logoUrl);
  
  // Save logo to local storage
  localStorage.setItem('offlineLogo', logoUrl);
  
  // Dispatch custom event for direct component updates
  dispatchLogoUpdatedEvent(logoUrl);
  
  // Force direct DOM updates as a reliable fallback
  setTimeout(() => {
    try {
      // Update all possible logo image elements
      const logoImages = document.querySelectorAll('img.header-logo-image, img.avatar-image');
      console.log(`Found ${logoImages.length} logo elements to update directly`);
      
      logoImages.forEach(img => {
        if (img instanceof HTMLImageElement) {
          console.log("Directly updating image element:", img);
          img.src = logoUrl;
        }
      });
    } catch (error) {
      console.error("Error during direct DOM update:", error);
    }
  }, 100);
}
