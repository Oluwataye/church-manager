
import { createContext, useContext } from "react";
import { AuthContextType } from "./authTypes";

// Create AuthContext with default values
export const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isLoading: true,
  isOffline: false,
  logout: async () => {},
});

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
