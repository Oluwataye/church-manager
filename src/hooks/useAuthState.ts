import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { processPendingSync } from "@/services/syncService";
import { CustomUser } from "@/components/Auth/authTypes";
import { auditAuthEvent } from "@/utils/auditLog";

const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;

export function useAuthState() {
  const [user, setUser] = useState<User | CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isOffline = !navigator.onLine;

  useEffect(() => {
    const handleOnline = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      });
      
      if (!isElectron) {
        processPendingSync();
      }
    };

    const handleOffline = () => {
      // In offline mode, maintain current session if valid
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          navigate('/login');
        }
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
        }
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event);
          
          if (session?.user) {
            setUser(session.user);
            
            if (event === 'SIGNED_IN') {
              const intendedPath = sessionStorage.getItem('intendedPath') || '/';
              sessionStorage.removeItem('intendedPath');
              navigate(intendedPath);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            navigate('/login');
          }
        });

        setIsLoading(false);
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  const logout = async () => {
    try {
      const userId = 'id' in (user || {}) ? (user as User).id : undefined;
      
      await supabase.auth.signOut();
      
      // Audit logout event
      if (userId) {
        await auditAuthEvent('logout', userId);
      }
      
      setUser(null);
      navigate("/login", { replace: true });
      
      toast({
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      
      // Audit failed logout attempt
      const userId = 'id' in (user || {}) ? (user as User).id : undefined;
      if (userId) {
        await auditAuthEvent('logout', userId, { 
          success: false, 
          error: error.message 
        });
      }
      
      setUser(null);
      navigate("/login", { replace: true });
      
      toast({
        description: "You have been logged out successfully.",
      });
    }
  };

  return { user, isLoading, isOffline, logout };
}
