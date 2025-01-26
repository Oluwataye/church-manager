import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MemberRegistrationFormProps {
  onSubmit: (member: any) => void;
  onCancel: () => void;
}

export function MemberRegistrationForm({
  onSubmit,
  onCancel,
}: MemberRegistrationFormProps) {
  const [formData, setFormData] = useState({
    familyName: "",
    individualNames: "",
    maritalStatus: "",
    numberOfChildren: 0,
    foundationClassDate: "",
    baptism: "",
    baptismYear: "",
    wofbiClass: "",
    joiningLocation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="familyName">Family Name</Label>
          <Input
            id="familyName"
            name="familyName"
            value={formData.familyName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="individualNames">Individual Names</Label>
          <Input
            id="individualNames"
            name="individualNames"
            value={formData.individualNames}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select
            name="maritalStatus"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, maritalStatus: value }))
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
            value={formData.numberOfChildren}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="foundationClassDate">Foundation Class Date</Label>
          <Input
            id="foundationClassDate"
            name="foundationClassDate"
            type="date"
            value={formData.foundationClassDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="baptism">Baptism</Label>
          <Select
            name="baptism"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, baptism: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select baptism type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="holy-ghost">Holy Ghost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="baptismYear">Baptism Year</Label>
          <Input
            id="baptismYear"
            name="baptismYear"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.baptismYear}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="wofbiClass">WOFBI Class</Label>
          <Select
            name="wofbiClass"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, wofbiClass: value }))
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
        </div>

        <div>
          <Label htmlFor="joiningLocation">Joining Location</Label>
          <Input
            id="joiningLocation"
            name="joiningLocation"
            value={formData.joiningLocation}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Register Member</Button>
      </div>
    </form>
  );
}