import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WofbiSectionProps {
  wofbiClass: {
    type: string;
    year: string;
  };
  onChange: (wofbiClass: { type: string; year: string }) => void;
}

export function WofbiSection({ wofbiClass, onChange }: WofbiSectionProps) {
  return (
    <div className="space-y-2">
      <Label>WOFBI Class</Label>
      <Select
        value={wofbiClass.type}
        onValueChange={(value) =>
          onChange({ ...wofbiClass, type: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select WOFBI class" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="BCC">BCC</SelectItem>
          <SelectItem value="LCC">LCC</SelectItem>
          <SelectItem value="LDC">LDC</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="WOFBI Year"
        value={wofbiClass.year}
        onChange={(e) =>
          onChange({ ...wofbiClass, year: e.target.value })
        }
        min="1900"
        max={new Date().getFullYear()}
      />
    </div>
  );
}