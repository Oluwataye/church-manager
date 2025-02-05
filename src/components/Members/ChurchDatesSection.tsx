
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChurchDatesSectionProps {
  foundationClassDate: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ChurchDatesSection({
  foundationClassDate,
  onChange,
}: ChurchDatesSectionProps) {
  return (
    <div>
      <Label htmlFor="foundation_class_date">LFC Join Date</Label>
      <Input
        id="foundation_class_date"
        name="foundation_class_date"
        type="date"
        value={foundationClassDate}
        onChange={onChange}
      />
    </div>
  );
}
