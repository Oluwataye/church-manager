
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { initSyncListener, processPendingSync } from "@/services/syncService";

interface CustomUser {
  email: string;
  role: string;
  lastLoginTime: string;
}

interface AuthContextType {
  user: User | CustomUser | null;
  isLoading: boolean;
  isOffline: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isLoading: true,
  isOffline: false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // When coming back online, re-check auth state
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          // If no session but local login exists, keep using local auth
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            setUser(JSON.parse(currentUser));
          } else {
            setUser(null);
          }
        }
      });
      
      // Try to sync offline changes
      processPendingSync();
    };

    const handleOffline = () => {
      setIsOffline(true);
      // When offline, rely on cached auth state from localStorage
      const currentUser = localStorage.getItem('currentUser');
      const lastLoginTime = localStorage.getItem('lastLoginTime');
      
      if (currentUser) {
        // Check if login is too old (more than 7 days)
        if (lastLoginTime && Date.now() - new Date(lastLoginTime).getTime() > 7 * 24 * 60 * 60 * 1000) {
          // If login is too old, log out
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

    // Initialize sync listener
    const cleanupSyncListener = initSyncListener();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanupSyncListener();
    };
  }, [navigate]);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // First check for local user (for offline capability)
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
          setUser(JSON.parse(currentUser));
          setIsLoading(false);
        }
        
        // If online, check for Supabase session
        if (navigator.onLine) {
          // Check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            setUser(session.user);
            
            // Update local storage for offline capability
            localStorage.setItem('lastLoginTime', new Date().toISOString());
            localStorage.setItem('currentUser', JSON.stringify({
              email: session.user.email,
              role: 'user', // Default role, could be enhanced with a roles table
              lastLoginTime: new Date().toISOString()
            }));
          }
          
          // Set up real-time subscription to auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (session?.user) {
              setUser(session.user);
              
              // Update local storage for offline capability
              localStorage.setItem('lastLoginTime', new Date().toISOString());
              localStorage.setItem('currentUser', JSON.stringify({
                email: session.user.email,
                role: 'user', // Default role, could be enhanced with a roles table
                lastLoginTime: new Date().toISOString()
              }));
              
              if (event === 'SIGNED_IN') {
                // Get the intended path or default to '/'
                const intendedPath = sessionStorage.getItem('intendedPath') || '/';
                sessionStorage.removeItem('intendedPath'); // Clean up
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
        if (!navigator.onLine) {
          toast({
            title: "Offline Mode",
            description: "Some features may be limited while offline.",
          });
        }
      }
    };

    initializeAuth();
  }, [navigate]);

  const logout = async () => {
    try {
      // If online, sign out from Supabase
      if (navigator.onLine) {
        await supabase.auth.signOut();
      }
      
      // Always clear local storage credentials
      localStorage.removeItem('currentUser');
      localStorage.removeItem('lastLoginTime');
      setUser(null);
      navigate("/login", { replace: true });
      
      toast({
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      
      // Even if Supabase logout fails, do a local logout
      localStorage.removeItem('currentUser');
      localStorage.removeItem('lastLoginTime');
      setUser(null);
      navigate("/login", { replace: true });
      
      toast({
        description: "You have been logged out successfully (offline mode).",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isOffline, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
