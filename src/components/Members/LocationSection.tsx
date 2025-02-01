import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nigerianCities } from "@/utils/nigerianCities";

interface LocationSectionProps {
  joiningLocation: string;
  customLocation: string;
  onLocationChange: (location: string) => void;
  onCustomLocationChange: (location: string) => void;
}

export function LocationSection({
  joiningLocation,
  customLocation,
  onLocationChange,
  onCustomLocationChange,
}: LocationSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="joiningLocation">Joining Location</Label>
      <Select
        value={joiningLocation}
        onValueChange={onLocationChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {nigerianCities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      {joiningLocation === "other" && (
        <Input
          placeholder="Enter custom location"
          value={customLocation}
          onChange={(e) => onCustomLocationChange(e.target.value)}
        />
      )}
    </div>
  );
}