
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useLoginFunctions() {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Common state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // First check if credentials match local users (for offline mode)
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const user = localUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        // Store login time
        localStorage.setItem('lastLoginTime', new Date().toISOString());
        localStorage.setItem('currentUser', JSON.stringify({ 
          email: user.email, 
          role: user.role,
          lastLoginTime: new Date().toISOString()
        }));
        
        // If online, try to authenticate with Supabase as well
        if (navigator.onLine) {
          try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (!signInError && data?.user) {
              // Update last login time
              localStorage.setItem('lastLoginTime', new Date().toISOString());
            }
          } catch (error) {
            console.log("Online authentication failed, but local auth succeeded");
            // Continue anyway since local auth passed
          }
        }
        
        toast({
          variant: "success",
          title: "Welcome Back!",
          description: "You have successfully logged in."
        });

        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else if (navigator.onLine) {
        // If no local match but online, try Supabase
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw new Error('Invalid email or password. Please try again.');
        }

        if (data?.user) {
          // Store user locally for future offline logins
          localUsers.push({ email, password, role: 'user' });
          localStorage.setItem('localUsers', JSON.stringify(localUsers));
          localStorage.setItem('lastLoginTime', new Date().toISOString());
          localStorage.setItem('currentUser', JSON.stringify({ 
            email,
            role: 'user',
            lastLoginTime: new Date().toISOString()
          }));
          
          toast({
            variant: "success",
            title: "Welcome Back!",
            description: "You have successfully logged in."
          });

          const from = location.state?.from?.pathname || "/";
          navigate(from, { replace: true });
        }
      } else {
        throw new Error('Invalid email or password. Please try again.');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || 'Error logging in. Please try again.');
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || 'Error logging in. Please try again.'
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
