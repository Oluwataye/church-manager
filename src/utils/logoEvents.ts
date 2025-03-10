
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
  
  // Dispatch at both document and window level for maximum compatibility
  document.dispatchEvent(logoUpdatedEvent);
  window.dispatchEvent(logoUpdatedEvent);
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
  
  // Direct DOM update as a fallback approach
  // This ensures even components not listening for events get updated
  setTimeout(() => {
    try {
      // Try to directly update DOM elements as a fallback
      // Target all possible logo image elements by selector
      const headerLogoElements = document.querySelectorAll(
        '#header-logo-avatar .header-logo-image, ' +
        '.header-logo img, ' + 
        '.header-logo-container img, ' + 
        '.avatar-image, ' +
        '.header-logo-image'
      );
      
      if (headerLogoElements.length > 0) {
        console.log(`Found ${headerLogoElements.length} header logo elements to update`);
        headerLogoElements.forEach((img) => {
          if (img instanceof HTMLImageElement) {
            console.log("Directly updating logo image element to:", logoUrl);
            img.src = logoUrl;
          }
        });
      } else {
        console.log("No logo elements found for direct update");
      }
    } catch (error) {
      console.error("Error updating logo elements:", error);
    }
  }, 100); // Small delay to ensure components have rendered
}
