
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/Login/LoginForm";
import { OfflineAlert } from "@/components/Login/OfflineAlert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Default admin credentials for offline setup
const ADMIN_EMAIL = "admin@lfcc.com";
const ADMIN_PASSWORD = "admin123";

export default function Login() {
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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if this is a first-time setup (no users exist in local storage)
  const checkFirstTimeSetup = () => {
    return !localStorage.getItem('lastLoginTime') && !localStorage.getItem('localUsers');
  };

  useEffect(() => {
    // Initialize local users storage if it doesn't exist
    if (!localStorage.getItem('localUsers')) {
      localStorage.setItem('localUsers', JSON.stringify([
        { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' }
      ]));
    }
    
    // If it's a first-time setup, switch to the register tab
    if (checkFirstTimeSetup()) {
      setActiveTab("register");
    }
  }, []);

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
      
      // If online, try to register with Supabase
      if (navigator.onLine) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: regEmail,
          password: regPassword
        });
        
        if (signUpError) {
          throw signUpError;
        }
      }
      
      // Add to local users regardless of online status
      const isFirstUser = localUsers.length === 1 && localUsers[0].email === ADMIN_EMAIL;
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
        description: "Your account has been created and you're now logged in.",
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ChurchLogo displayOnly />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Living Faith Church Chanchaga
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Church Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {checkFirstTimeSetup() ? "First-time Setup" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-center">
              {checkFirstTimeSetup() 
                ? "Create your admin account to get started" 
                : "Sign in to your account or create a new one"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isOffline && <OfflineAlert />}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="block w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="block w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-church-600 hover:bg-church-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                  
                  {!checkFirstTimeSetup() && (
                    <div className="text-center mt-2">
                      <Button 
                        variant="link" 
                        type="button"
                        onClick={() => setActiveTab("register")}
                      >
                        Don't have an account? Sign up
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email address</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="block w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      placeholder="Create a password"
                      className="block w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your password"
                      className="block w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-church-600 hover:bg-church-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : (checkFirstTimeSetup() ? "Set Up Admin Account" : "Create Account")}
                  </Button>
                  
                  {!checkFirstTimeSetup() && (
                    <div className="text-center mt-2">
                      <Button 
                        variant="link" 
                        type="button"
                        onClick={() => setActiveTab("login")}
                      >
                        Already have an account? Sign in
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
