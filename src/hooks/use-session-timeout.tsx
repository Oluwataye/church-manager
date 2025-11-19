import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/Auth/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_BEFORE = 5 * 60 * 1000; // 5 minutes before expiry

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
        description: "Your session will expire in 5 minutes due to inactivity.",
        duration: 10000,
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
      resetTimeout();
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [logout]);
}
