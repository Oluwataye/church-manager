import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MemberTypeSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function MemberTypeSelection({ value, onChange }: MemberTypeSelectionProps) {
  return (
    <div>
      <Label>Member Type</Label>
      <RadioGroup
        defaultValue={value}
        onValueChange={onChange}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual">Individual</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="family" id="family" />
          <Label htmlFor="family">Family</Label>
        </div>
      </RadioGroup>
    </div>
  );
}