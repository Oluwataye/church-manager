
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
        <Label htmlFor="family_name">Family Name</Label>
        <Input
          id="family_name"
          name="family_name"
          value={familyName}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="individual_names">Individual Names</Label>
        <Input
          id="individual_names"
          name="individual_names"
          value={individualNames}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="marital_status">Marital Status</Label>
        <Select
          value={maritalStatus}
          onValueChange={(value) =>
            onChange({
              target: { name: "marital_status", value },
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
        <Label htmlFor="number_of_children">Number of Children</Label>
        <Input
          id="number_of_children"
          name="number_of_children"
          type="number"
          min="0"
          value={numberOfChildren}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
