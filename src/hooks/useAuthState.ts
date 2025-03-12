import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, localApi } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { processPendingSync } from "@/services/syncService";
import { CustomUser } from "@/components/Auth/authTypes";

const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
const authClient = isElectron ? localApi : supabase;

export function useAuthState() {
  const [user, setUser] = useState<User | CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isOffline = !navigator.onLine;

  useEffect(() => {
    const handleOnline = () => {
      authClient.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            setUser(JSON.parse(currentUser));
          } else {
            setUser(null);
          }
        }
      });
      
      if (!isElectron) {
        processPendingSync();
      }
    };

    const handleOffline = () => {
      const currentUser = localStorage.getItem('currentUser');
      const lastLoginTime = localStorage.getItem('lastLoginTime');
      
      if (currentUser) {
        if (lastLoginTime && Date.now() - new Date(lastLoginTime).getTime() > 7 * 24 * 60 * 60 * 1000) {
          setUser(null);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('lastLoginTime');
          navigate('/login');
        } else {
          setUser(JSON.parse(currentUser));
        }
      } else {
        setUser(null);
        navigate('/login');
      }
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
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
          setUser(JSON.parse(currentUser));
          setIsLoading(false);
        }
        
        if (navigator.onLine || isElectron) {
          const { data: { session } } = await authClient.auth.getSession();
          
          if (session?.user) {
            setUser(session.user);
            
            localStorage.setItem('lastLoginTime', new Date().toISOString());
            localStorage.setItem('currentUser', JSON.stringify({
              email: session.user.email,
              role: 'user',
              lastLoginTime: new Date().toISOString()
            }));
          }
          
          const { data: { subscription } } = authClient.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (session?.user) {
              setUser(session.user);
              
              localStorage.setItem('lastLoginTime', new Date().toISOString());
              localStorage.setItem('currentUser', JSON.stringify({
                email: session.user.email,
                role: 'user',
                lastLoginTime: new Date().toISOString()
              }));
              
              if (event === 'SIGNED_IN') {
                const intendedPath = sessionStorage.getItem('intendedPath') || '/';
                sessionStorage.removeItem('intendedPath');
                navigate(intendedPath);
              }
            } else if (event === 'SIGNED_OUT') {
              localStorage.removeItem('currentUser');
              localStorage.removeItem('lastLoginTime');
              setUser(null);
              navigate('/login');
            }
          });

          setIsLoading(false);
          return () => {
            subscription.unsubscribe();
          };
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
        if (!navigator.onLine && !isElectron) {
          toast({
            title: "Offline Mode",
            description: "Some features may be limited while offline.",
          });
        }
      }
    };

    initializeAuth();
  }, [navigate, toast]);

  const logout = async () => {
    try {
      await authClient.auth.signOut();
      
      localStorage.removeItem('currentUser');
      localStorage.removeItem('lastLoginTime');
      setUser(null);
      navigate("/login", { replace: true });
      
      toast({
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      
      localStorage.removeItem('currentUser');
      localStorage.removeItem('lastLoginTime');
      setUser(null);
      navigate("/login", { replace: true });
      
      toast({
        description: "You have been logged out successfully (offline mode).",
      });
    }
  };

  return { user, isLoading, isOffline, logout };
}
