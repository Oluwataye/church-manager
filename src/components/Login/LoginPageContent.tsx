
import { useEffect } from "react";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { OfflineAlert } from "@/components/Login/OfflineAlert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoginForm, RegistrationForm } from "@/components/Auth/LoginComponents";
import { useLoginFunctions } from "@/hooks/useLoginFunctions";
import { checkFirstTimeSetup, initializeLocalUsers } from "@/components/Auth/AuthUtils";
import { useAuthStatus } from "@/components/Auth/AuthUtils";

export function LoginPageContent() {
  const { isOffline } = useAuthStatus();
  const {
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
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  error={error}
                  isLoading={isLoading}
                  onSubmit={handleLogin}
                />
                
                {!checkFirstTimeSetup() && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="link" 
                      type="button"
                      onClick={() => setActiveTab("register")}
                    >
                      Don't have an account? Sign up
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="register">
                <RegistrationForm
                  email={regEmail}
                  setEmail={setRegEmail}
                  password={regPassword}
                  setPassword={setRegPassword}
                  confirmPassword={regConfirmPassword}
                  setConfirmPassword={setRegConfirmPassword}
                  error={error}
                  isLoading={isLoading}
                  onSubmit={handleRegister}
                  isFirstTimeSetup={checkFirstTimeSetup()}
                />
                
                {!checkFirstTimeSetup() && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="link" 
                      type="button"
                      onClick={() => setActiveTab("login")}
                    >
                      Already have an account? Sign in
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
