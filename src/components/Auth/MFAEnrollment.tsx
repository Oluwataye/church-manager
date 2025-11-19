import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Check } from "lucide-react";

export function MFAEnrollment() {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const { toast } = useToast();

  const enrollMFA = async () => {
    setIsEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Admin MFA'
      });

      if (error) throw error;

      if (data) {
        setQrCode(data.totp.qr_code);
        setFactorId(data.id);
        toast({
          title: "MFA Setup Started",
          description: "Scan the QR code with your authenticator app.",
        });
      }
    } catch (error: any) {
      console.error("MFA enrollment error:", error);
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: error.message,
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const verifyMFA = async () => {
    if (!factorId || !verifyCode) return;

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode
      });

      if (error) throw error;

      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been successfully enabled.",
      });
      
      setQrCode(null);
      setVerifyCode("");
      setFactorId(null);
    } catch (error: any) {
      console.error("MFA verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your admin account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!qrCode ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Enable MFA to protect your admin account. You'll need an authenticator app like Google Authenticator or Authy.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={enrollMFA} 
              disabled={isEnrolling}
              className="w-full"
            >
              {isEnrolling ? "Setting up..." : "Enable MFA"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
            </div>
            <Alert>
              <AlertDescription>
                Scan this QR code with your authenticator app, then enter the 6-digit code below to verify.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="verify-code">Verification Code</Label>
              <Input
                id="verify-code"
                type="text"
                placeholder="000000"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>
            <Button 
              onClick={verifyMFA} 
              disabled={isVerifying || verifyCode.length !== 6}
              className="w-full"
            >
              {isVerifying ? "Verifying..." : "Verify and Enable"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
