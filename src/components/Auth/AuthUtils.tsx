
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Default admin credentials for offline setup
export const ADMIN_EMAIL = "admin@lfcc.com";
export const ADMIN_PASSWORD = "admin123";

// Check if this is a first-time setup
export const checkFirstTimeSetup = (): boolean => {
  return !localStorage.getItem('lastLoginTime') && !localStorage.getItem('localUsers');
};

// Initialize local users for offline login
export const initializeLocalUsers = (): void => {
  if (!localStorage.getItem('localUsers')) {
    localStorage.setItem('localUsers', JSON.stringify([
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' }
    ]));
  }
};

// Auth-related interfaces
export interface LocalUser {
  email: string;
  password: string;
  role: string;
}

// Hook for handling offline and online status for auth
export function useAuthStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOffline };
}
