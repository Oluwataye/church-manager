import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

interface MFAVerificationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function MFAVerification({ onSuccess, onCancel }: MFAVerificationProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const verifyCode = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) throw factors.error;

      const totpFactor = factors.data?.totp?.[0];
      if (!totpFactor) {
        throw new Error("No MFA factor found");
      }

      const challenge = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id
      });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code
      });
      if (verify.error) throw verify.error;

      toast({
        title: "Verification Successful",
        description: "You have been authenticated.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("MFA verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Invalid verification code.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mfa-code">Verification Code</Label>
          <Input
            id="mfa-code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={verifyCode} 
            disabled={isVerifying || code.length !== 6}
            className="flex-1"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
          <Button 
            variant="outline"
            onClick={onCancel}
            disabled={isVerifying}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
