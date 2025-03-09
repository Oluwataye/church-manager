
import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/Auth/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TIMEOUT_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const WARNING_BEFORE = 30 * 60 * 1000; // 30 minutes before expiry

export function useSessionTimeout() {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const { logout } = useAuth();
  const { toast } = useToast();

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      toast({
        title: "Session Warning",
        description: "Your session will expire in 30 minutes. Please save your work.",
        duration: 10000, // Show for 10 seconds
      });
    }, TIMEOUT_DURATION - WARNING_BEFORE);

    // Set actual timeout
    timeoutRef.current = setTimeout(() => {
      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity.",
      });
      logout();
    }, TIMEOUT_DURATION);
  };

  useEffect(() => {
    const handleActivity = () => {
      // Only reset if we're online
      if (navigator.onLine) {
        resetTimeout();
      }
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    // Add online/offline handlers
    window.addEventListener('online', resetTimeout);
    window.addEventListener('offline', () => {
      // When offline, clear timeouts to prevent unwanted logouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('online', resetTimeout);
      window.removeEventListener('offline', () => {});
    };
  }, [logout]);
}
