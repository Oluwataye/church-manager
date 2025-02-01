import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalInfoSectionProps {
  familyName: string;
  individualNames: string;
  maritalStatus: string;
  numberOfChildren: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function PersonalInfoSection({
  familyName,
  individualNames,
  maritalStatus,
  numberOfChildren,
  onChange,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="familyName">Family Name</Label>
        <Input
          id="familyName"
          name="familyName"
          value={familyName}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="individualNames">Individual Names</Label>
        <Input
          id="individualNames"
          name="individualNames"
          value={individualNames}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="maritalStatus">Marital Status</Label>
        <Select
          value={maritalStatus}
          onValueChange={(value) =>
            onChange({
              target: { name: "maritalStatus", value },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select marital status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="numberOfChildren">Number of Children</Label>
        <Input
          id="numberOfChildren"
          name="numberOfChildren"
          type="number"
          min="0"
          value={numberOfChildren}
          onChange={onChange}
        />
      </div>
    </div>
  );
}