
import { createContext, useContext } from "react";
import { initSyncListener } from "@/services/syncService";
import { useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { AuthContextType } from "./authTypes";

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isLoading: true,
  isOffline: false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthState();
  
  useEffect(() => {
    // Initialize sync listener
    const cleanupSyncListener = initSyncListener();
    return () => cleanupSyncListener();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
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
