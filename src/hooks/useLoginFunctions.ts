
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkRateLimit, handleRateLimitError } from "@/utils/rateLimit";
import { auditAuthEvent } from "@/utils/auditLog";

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
      // Check rate limit
      const rateLimitResult = await checkRateLimit('auth/login', 'auth');
      
      if (!rateLimitResult.allowed) {
        const errorMsg = handleRateLimitError(rateLimitResult);
        setError(errorMsg);
        toast({
          variant: "destructive",
          title: "Too Many Attempts",
          description: errorMsg,
        });
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Audit failed login attempt
        await auditAuthEvent('login', undefined, { 
          email, 
          success: false, 
          error: signInError.message 
        });
        throw new Error('Invalid email or password. Please try again.');
      }

      if (data?.user) {
        // Audit successful login
        await auditAuthEvent('login', data.user.id, { 
          email, 
          success: true 
        });

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
