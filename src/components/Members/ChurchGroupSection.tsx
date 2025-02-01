import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { groups } from "@/components/Groups/GroupList";

interface ChurchGroupSectionProps {
  churchGroup: string;
  onChange: (value: string) => void;
}

export function ChurchGroupSection({
  churchGroup,
  onChange,
}: ChurchGroupSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="churchGroup">Church Group</Label>
      <Select value={churchGroup} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a church group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}