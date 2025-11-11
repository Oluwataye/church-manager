import { Progress } from "@/components/ui/progress";
import { calculatePasswordStrength, PasswordStrength } from "@/utils/passwordStrength";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const strength: PasswordStrength = calculatePasswordStrength(password);
  const progressValue = (strength.score / 4) * 100;

  const getIcon = () => {
    if (strength.score >= 3) return <ShieldCheck className="h-4 w-4" />;
    if (strength.score >= 2) return <Shield className="h-4 w-4" />;
    return <ShieldAlert className="h-4 w-4" />;
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div style={{ color: strength.color }}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <Progress 
            value={progressValue} 
            className="h-2"
            style={{
              ['--progress-background' as any]: strength.color
            }}
          />
        </div>
        <span 
          className="text-xs font-medium"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      </div>
      
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {strength.feedback.map((item, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-muted-foreground mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
