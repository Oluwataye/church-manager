import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface MemberTypeSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function MemberTypeSelection({
  value,
  onChange,
}: MemberTypeSelectionProps) {
  return (
    <div className="space-y-2">
      <Label>Member Type</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">Individual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="family" id="family" />
            <Label htmlFor="family">Family</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}