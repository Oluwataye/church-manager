
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
  // Dispatch custom event for direct component updates
  const logoUpdatedEvent = new CustomEvent('logoUpdated', {
    detail: { logoUrl }
  }) as LogoUpdatedEvent;
  
  window.dispatchEvent(logoUpdatedEvent);
}

/**
 * Updates the logo in local storage and the DOM
 */
export function updateHeaderLogo(logoUrl: string): void {
  // Save logo to local storage
  localStorage.setItem('offlineLogo', logoUrl);
  
  // Dispatch custom event for direct component updates
  dispatchLogoUpdatedEvent(logoUrl);
  
  // Try to directly update DOM elements as a fallback
  const headerLogoImage = document.querySelector('#header-logo-avatar .header-logo-image');
  if (headerLogoImage instanceof HTMLImageElement) {
    console.log("Updating header logo image to:", logoUrl);
    headerLogoImage.src = logoUrl;
  }

  const allHeaderImages = document.querySelectorAll('.header-logo img, .header-logo-container img, .header-logo-image');
  allHeaderImages.forEach((img) => {
    if (img instanceof HTMLImageElement) {
      console.log("Updating header image to:", logoUrl);
      img.src = logoUrl;
    }
  });
}
