
import type { User } from "@supabase/supabase-js";

export interface CustomUser {
  email: string;
  role: string;
  lastLoginTime: string;
}

export interface AuthContextType {
  user: User | CustomUser | null;
  isLoading: boolean;
  isOffline: boolean;
  logout: () => Promise<void>;
}
