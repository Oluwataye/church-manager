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
      <Label htmlFor="foundationClassDate">LFC Join Date</Label>
      <Input
        id="foundationClassDate"
        name="foundationClassDate"
        type="date"
        value={foundationClassDate}
        onChange={onChange}
      />
    </div>
  );
}