import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BaptismSectionProps {
  baptism: {
    water: boolean;
    holyGhost: boolean;
    year: string;
  };
  onChange: (baptism: { water: boolean; holyGhost: boolean; year: string }) => void;
}

export function BaptismSection({ baptism, onChange }: BaptismSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Baptism</Label>
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="waterBaptism"
            checked={baptism.water}
            onChange={(e) =>
              onChange({ ...baptism, water: e.target.checked })
            }
          />
          <Label htmlFor="waterBaptism">Water</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="holyGhostBaptism"
            checked={baptism.holyGhost}
            onChange={(e) =>
              onChange({ ...baptism, holyGhost: e.target.checked })
            }
          />
          <Label htmlFor="holyGhostBaptism">Holy Ghost</Label>
        </div>
      </div>
      <Input
        type="number"
        placeholder="Baptism Year"
        value={baptism.year}
        onChange={(e) =>
          onChange({ ...baptism, year: e.target.value })
        }
        min="1900"
        max={new Date().getFullYear()}
      />
    </div>
  );
}