
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useLoginFunctions() {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Common state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error('Invalid email or password. Please try again.');
      }

      if (data?.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || 'Error logging in. Please try again.');
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Error logging in. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Login state
    email,
    setEmail,
    password,
    setPassword,
    
    // Common state
    error,
    isLoading,
    
    // Handlers
    handleLogin
  };
}
