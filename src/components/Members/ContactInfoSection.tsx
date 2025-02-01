import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoSectionProps {
  contactNumber: string;
  contactAddress: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactInfoSection({
  contactNumber,
  contactAddress,
  onChange,
}: ContactInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          value={contactNumber}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="contactAddress">Contact Address</Label>
        <Input
          id="contactAddress"
          name="contactAddress"
          value={contactAddress}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}