
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
    family_name: "",
    individual_names: "",
    marital_status: "",
    number_of_children: 0,
    contact_number: "",
    contact_address: "",
    foundation_class_date: "",
    baptism_water: false,
    baptism_holy_ghost: false,
    baptism_year: "",
    wofbi_class_type: "",
    wofbi_year: "",
    joining_location: "",
    customLocation: "",
    member_type: "individual",
    profile_photo: "",
    church_group: "",
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalLocation = formData.joining_location === "other" 
      ? formData.customLocation 
      : formData.joining_location;
    
    const memberData = {
      family_name: formData.family_name,
      individual_names: formData.individual_names,
      marital_status: formData.marital_status,
      number_of_children: Number(formData.number_of_children),
      contact_number: formData.contact_number,
      contact_address: formData.contact_address,
      foundation_class_date: formData.foundation_class_date,
      baptism_water: formData.baptism_water,
      baptism_holy_ghost: formData.baptism_holy_ghost,
      baptism_year: formData.baptism_year,
      wofbi_class_type: formData.wofbi_class_type,
      wofbi_year: formData.wofbi_year,
      joining_location: finalLocation,
      member_type: formData.member_type,
      profile_photo: formData.profile_photo,
      church_group: formData.church_group,
    };

    onSubmit(memberData);
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
          profilePhoto={formData.profile_photo}
          familyName={formData.family_name}
          onPhotoChange={(photo) =>
            setFormData((prev) => ({ ...prev, profile_photo: photo }))
          }
        />

        <MemberTypeSelection
          value={formData.member_type}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, member_type: value }))
          }
        />

        <PersonalInfoSection
          familyName={formData.family_name}
          individualNames={formData.individual_names}
          maritalStatus={formData.marital_status}
          numberOfChildren={formData.number_of_children}
          onChange={handleChange}
        />

        <ContactInfoSection
          contactNumber={formData.contact_number}
          contactAddress={formData.contact_address}
          onChange={handleChange}
        />

        <ChurchDatesSection
          foundationClassDate={formData.foundation_class_date}
          onChange={handleChange}
        />

        <LocationSection
          joiningLocation={formData.joining_location}
          customLocation={formData.customLocation}
          onLocationChange={(location) =>
            setFormData((prev) => ({ ...prev, joining_location: location }))
          }
          onCustomLocationChange={(location) =>
            setFormData((prev) => ({ ...prev, customLocation: location }))
          }
        />

        <WofbiSection
          wofbiClass={{
            type: formData.wofbi_class_type,
            year: formData.wofbi_year,
          }}
          onChange={({ type, year }) =>
            setFormData((prev) => ({
              ...prev,
              wofbi_class_type: type,
              wofbi_year: year,
            }))
          }
        />

        <BaptismSection
          baptism={{
            water: formData.baptism_water,
            holyGhost: formData.baptism_holy_ghost,
            year: formData.baptism_year,
          }}
          onChange={(baptism) =>
            setFormData((prev) => ({
              ...prev,
              baptism_water: baptism.water,
              baptism_holy_ghost: baptism.holyGhost,
              baptism_year: baptism.year,
            }))
          }
        />

        <ChurchGroupSection
          churchGroup={formData.church_group}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, church_group: value }))
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
