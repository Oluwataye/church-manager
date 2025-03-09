
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkFirstTimeSetup } from "@/components/Auth/AuthUtils";

export function useLoginFunctions() {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  
  // Common state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(
    checkFirstTimeSetup() ? "register" : "login"
  );
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

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
          title: "Welcome back!",
          description: "You have successfully logged in.",
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
            title: "Welcome back!",
            description: "You have successfully logged in.",
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
        title: "Error",
        description: error.message || 'Error logging in. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate password match
      if (regPassword !== regConfirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // Validate password strength
      if (regPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Check if email is already in use locally
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const existingUser = localUsers.find((u: any) => u.email === regEmail);
      
      if (existingUser) {
        throw new Error('Email already in use. Please login instead.');
      }
      
      // Only attempt online registration if we're actually online
      if (navigator.onLine) {
        try {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: regEmail,
            password: regPassword
          });
          
          if (signUpError) {
            throw signUpError;
          }
        } catch (error) {
          console.log("Online registration failed, continuing with local registration");
          // We'll continue with local registration below
        }
      }
      
      // Add to local users regardless of online status
      const isFirstUser = localUsers.length === 1 && localUsers[0].email === "admin@lfcc.com";
      const newRole = isFirstUser ? 'admin' : 'user';
      
      localUsers.push({ email: regEmail, password: regPassword, role: newRole });
      localStorage.setItem('localUsers', JSON.stringify(localUsers));
      
      // Auto-login the new user
      localStorage.setItem('lastLoginTime', new Date().toISOString());
      localStorage.setItem('currentUser', JSON.stringify({ 
        email: regEmail,
        role: newRole,
        lastLoginTime: new Date().toISOString()
      }));
      
      toast({
        title: "Registration successful!",
        description: !navigator.onLine 
          ? "Your account has been created locally and you're now logged in." 
          : "Your account has been created and you're now logged in.",
      });
      
      navigate('/', { replace: true });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || 'Error registering account. Please try again.');
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: error.message || 'Error registering account. Please try again.',
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
    
    // Registration state
    regEmail,
    setRegEmail,
    regPassword,
    setRegPassword,
    regConfirmPassword,
    setRegConfirmPassword,
    
    // Common state
    error,
    isLoading,
    activeTab,
    setActiveTab,
    
    // Handlers
    handleLogin,
    handleRegister
  };
}
