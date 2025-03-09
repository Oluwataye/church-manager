
import { AuthContext } from "./AuthContext";
import { initSyncListener } from "@/services/syncService";
import { useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";

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
