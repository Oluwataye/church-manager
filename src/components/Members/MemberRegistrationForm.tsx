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
import { useToast } from "@/hooks/use-toast";
import { groups } from "@/components/Groups/GroupList";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { MemberTypeSelection } from "./MemberTypeSelection";
import { BaptismSection } from "./BaptismSection";
import { WofbiSection } from "./WofbiSection";
import { LocationSection } from "./LocationSection";

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
    baptism: {
      water: false,
      holyGhost: false,
      year: "",
    },
    wofbiClass: {
      type: "",
      year: "",
    },
    joiningLocation: "",
    customLocation: "",
    familyGroup: "",
    memberType: "individual",
    profilePhoto: "",
    churchGroup: "",
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = formData.joiningLocation === "other" 
      ? formData.customLocation 
      : formData.joiningLocation;
    
    const selectedGroup = groups.find(group => group.id.toString() === formData.churchGroup);
    if (selectedGroup) {
      selectedGroup.memberCount += 1;
    }
    
    onSubmit({
      ...formData,
      joiningLocation: finalLocation,
    });

    toast({
      title: "Success",
      description: `Member registered successfully${selectedGroup ? ` to ${selectedGroup.name}` : ''}`,
    });
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
        <ProfilePhotoUpload
          profilePhoto={formData.profilePhoto}
          familyName={formData.familyName}
          onPhotoChange={(photo) =>
            setFormData((prev) => ({ ...prev, profilePhoto: photo }))
          }
        />

        <MemberTypeSelection
          value={formData.memberType}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, memberType: value }))
          }
        />

        {formData.memberType === "family" && (
          <div>
            <Label htmlFor="familyGroup">Family Group</Label>
            <Input
              id="familyGroup"
              name="familyGroup"
              value={formData.familyGroup}
              onChange={handleChange}
              placeholder="Enter family group name"
            />
          </div>
        )}

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
            value={formData.maritalStatus}
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

        <BaptismSection
          baptism={formData.baptism}
          onChange={(baptism) =>
            setFormData((prev) => ({ ...prev, baptism }))
          }
        />

        <WofbiSection
          wofbiClass={formData.wofbiClass}
          onChange={(wofbiClass) =>
            setFormData((prev) => ({ ...prev, wofbiClass }))
          }
        />

        <LocationSection
          joiningLocation={formData.joiningLocation}
          customLocation={formData.customLocation}
          onLocationChange={(location) =>
            setFormData((prev) => ({ ...prev, joiningLocation: location }))
          }
          onCustomLocationChange={(location) =>
            setFormData((prev) => ({ ...prev, customLocation: location }))
          }
        />

        <div className="space-y-2">
          <Label htmlFor="churchGroup">Church Group</Label>
          <Select
            value={formData.churchGroup}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, churchGroup: value }))
            }
          >
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

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Register Member</Button>
        </div>
      </div>
    </form>
  );
}