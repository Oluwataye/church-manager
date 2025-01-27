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
import { nigerianCities } from "@/utils/nigerianCities";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

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
  });

  const { toast } = useToast();

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Profile photo must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profilePhoto: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = formData.joiningLocation === "other" 
      ? formData.customLocation 
      : formData.joiningLocation;
    
    onSubmit({
      ...formData,
      joiningLocation: finalLocation,
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
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.profilePhoto || "/placeholder.svg"} alt="Profile Photo" />
            <AvatarFallback>{formData.familyName?.[0] || "P"}</AvatarFallback>
          </Avatar>
          <div>
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePhotoUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("profile-upload")?.click()}
            >
              Upload Photo
            </Button>
          </div>
        </div>

        <div>
          <Label>Member Type</Label>
          <RadioGroup
            defaultValue="individual"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, memberType: value }))
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="family" id="family" />
              <Label htmlFor="family">Family</Label>
            </div>
          </RadioGroup>
        </div>

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

        <div className="space-y-2">
          <Label>Baptism</Label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="waterBaptism"
                checked={formData.baptism.water}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    baptism: { ...prev.baptism, water: e.target.checked },
                  }))
                }
              />
              <Label htmlFor="waterBaptism">Water</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="holyGhostBaptism"
                checked={formData.baptism.holyGhost}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    baptism: { ...prev.baptism, holyGhost: e.target.checked },
                  }))
                }
              />
              <Label htmlFor="holyGhostBaptism">Holy Ghost</Label>
            </div>
          </div>
          <Input
            type="number"
            placeholder="Baptism Year"
            value={formData.baptism.year}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                baptism: { ...prev.baptism, year: e.target.value },
              }))
            }
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="space-y-2">
          <Label>WOFBI Class</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                wofbiClass: { ...prev.wofbiClass, type: value },
              }))
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
            value={formData.wofbiClass.year}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                wofbiClass: { ...prev.wofbiClass, year: e.target.value },
              }))
            }
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="joiningLocation">Joining Location</Label>
          <Select
            name="joiningLocation"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, joiningLocation: value }))
            }
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
          {formData.joiningLocation === "other" && (
            <Input
              placeholder="Enter custom location"
              value={formData.customLocation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customLocation: e.target.value,
                }))
              }
            />
          )}
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
