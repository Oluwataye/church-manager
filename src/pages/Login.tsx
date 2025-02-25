
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/Login/LoginForm";
import { OfflineAlert } from "@/components/Login/OfflineAlert";

const ADMIN_EMAIL = "admin@lfcc.com";
const ADMIN_PASSWORD = "admin123";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // First check if credentials match admin user
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // If online, try to authenticate with Supabase
        if (navigator.onLine) {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            throw signInError;
          }

          if (data?.user) {
            localStorage.setItem('lastLoginTime', new Date().toISOString());
          }
        } else {
          // If offline, just store the login time
          localStorage.setItem('lastLoginTime', new Date().toISOString());
        }
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password. Please try again.');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError('Error logging in. Please try again.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error logging in. Please try again.",
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Living Faith Church Chanchaga
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isOffline && <OfflineAlert />}

          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            isLoading={isLoading}
            onSubmit={handleLogin}
          />
        </div>
      </div>
    </div>
  );
}
