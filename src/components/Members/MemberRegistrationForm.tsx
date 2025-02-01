import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { groups } from "@/components/Groups/GroupList";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { MemberTypeSelection } from "./MemberTypeSelection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { ChurchDatesSection } from "./ChurchDatesSection";
import { BaptismSection } from "./BaptismSection";
import { WofbiSection } from "./WofbiSection";
import { LocationSection } from "./LocationSection";
import { ChurchGroupSection } from "./ChurchGroupSection";

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
    contactNumber: "",
    contactAddress: "",
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

        <PersonalInfoSection
          familyName={formData.familyName}
          individualNames={formData.individualNames}
          maritalStatus={formData.maritalStatus}
          numberOfChildren={formData.numberOfChildren}
          onChange={handleChange}
        />

        <ContactInfoSection
          contactNumber={formData.contactNumber}
          contactAddress={formData.contactAddress}
          onChange={handleChange}
        />

        <ChurchDatesSection
          foundationClassDate={formData.foundationClassDate}
          onChange={handleChange}
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

        <WofbiSection
          wofbiClass={formData.wofbiClass}
          onChange={(wofbiClass) =>
            setFormData((prev) => ({ ...prev, wofbiClass }))
          }
        />

        <BaptismSection
          baptism={formData.baptism}
          onChange={(baptism) =>
            setFormData((prev) => ({ ...prev, baptism }))
          }
        />

        <ChurchGroupSection
          churchGroup={formData.churchGroup}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, churchGroup: value }))
          }
        />

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