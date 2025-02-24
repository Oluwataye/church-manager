
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // When coming back online, re-check auth state
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      // When offline, rely on cached auth state
      const lastLoginTime = localStorage.getItem('lastLoginTime');
      if (!lastLoginTime || Date.now() - new Date(lastLoginTime).getTime() > 24 * 60 * 60 * 1000) {
        // If last login was more than 24 hours ago, log out
        setUser(null);
        navigate('/login');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    };
  }, [navigate]);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        // Set up real-time subscription to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          setUser(session?.user ?? null);
          
          if (event === 'SIGNED_OUT') {
            localStorage.removeItem('lastLoginTime');
            navigate('/login');
          } else if (event === 'SIGNED_IN') {
            // Get the intended path or default to '/'
            const intendedPath = sessionStorage.getItem('intendedPath') || '/';
            sessionStorage.removeItem('intendedPath'); // Clean up
            navigate(intendedPath);
          }
        });

        setIsLoading(false);
        return () => {
          subscription.unsubscribe();
        };
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
      await supabase.auth.signOut();
      localStorage.removeItem('lastLoginTime');
      setUser(null);
      navigate("/login", { replace: true });
      toast({
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      if (!navigator.onLine) {
        // If offline, perform a "soft" logout
        localStorage.removeItem('lastLoginTime');
        setUser(null);
        navigate("/login", { replace: true });
        toast({
          description: "You have been logged out successfully (offline mode).",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error logging out",
          description: error.message,
        });
      }
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
