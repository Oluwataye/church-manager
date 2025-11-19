
import { AuthContext } from "./AuthContext";
import { initSyncListener } from "@/services/syncService";
import { useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useSessionTimeout } from "@/hooks/use-session-timeout";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthState();
  
  // Enable session timeout for authenticated users
  useSessionTimeout();
  
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
