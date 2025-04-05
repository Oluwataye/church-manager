
import { useEffect } from "react";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { OfflineAlert } from "@/components/Login/OfflineAlert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/Auth/LoginComponents";
import { useLoginFunctions } from "@/hooks/useLoginFunctions";
import { initializeLocalUsers } from "@/components/Auth/AuthUtils";
import { useAuthStatus } from "@/components/Auth/AuthUtils";

export function LoginPageContent() {
  const { isOffline } = useAuthStatus();
  const {
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
  } = useLoginFunctions();

  useEffect(() => {
    // Initialize local users storage if it doesn't exist
    initializeLocalUsers();
  }, []);

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
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
