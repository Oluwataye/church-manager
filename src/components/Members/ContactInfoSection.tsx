
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
        <Label htmlFor="contact_number">Contact Number</Label>
        <Input
          id="contact_number"
          name="contact_number"
          type="tel"
          value={contactNumber}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="contact_address">Contact Address</Label>
        <Input
          id="contact_address"
          name="contact_address"
          value={contactAddress}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}
