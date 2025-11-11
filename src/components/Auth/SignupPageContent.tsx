import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrationForm } from "@/components/Auth/LoginComponents";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { PasswordStrengthMeter } from "@/components/Auth/PasswordStrengthMeter";
import { useChurchName } from "@/hooks/useChurchName";

export function SignupPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { churchName } = useChurchName();

  // Check if user is already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength (16+ chars, special char required)
    if (password.length < 16) {
      setError("Password must be at least 16 characters long");
      setIsLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      setIsLoading(false);
      return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError("Password must contain at least one special character (!@#$%^&* etc.)");
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data?.user) {
        toast({
          title: "Account created successfully!",
          description: "You have been automatically signed in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "Error creating account. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error creating account. Please try again.",
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
          {churchName}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Church Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Sign up for a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                Password must be at least 16 characters and contain uppercase, lowercase, numbers, and special characters.
              </AlertDescription>
            </Alert>
            
            <RegistrationForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              error={error}
              isLoading={isLoading}
              onSubmit={handleSignup}
            />
            
            <PasswordStrengthMeter password={password} />

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-church-600 hover:text-church-700">
                Already have an account? Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
