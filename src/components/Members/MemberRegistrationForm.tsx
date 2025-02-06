import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { BaptismSection } from "./BaptismSection";
import { WofbiSection } from "./WofbiSection";
import { LocationSection } from "./LocationSection";
import { ChurchGroupSection } from "./ChurchGroupSection";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { MemberTypeSelection } from "./MemberTypeSelection";
import { ChurchDatesSection } from "./ChurchDatesSection";

interface Member {
  id: string;
  family_name: string;
  individual_names: string;
  marital_status: string;
  number_of_children: number;
  contact_number: string;
  contact_address: string;
  foundation_class_date: string;
  baptism_water: boolean;
  baptism_holy_ghost: boolean;
  baptism_year: string;
  wofbi_class_type: string;
  wofbi_year: string;
  joining_location: string;
  member_type: string;
  profile_photo?: string;
  church_group?: string;
}

interface MemberRegistrationFormProps {
  onSubmit: (data: Omit<Member, "id">) => Promise<void>;
  onCancel: () => void;
  initialData?: Member;
}

export function MemberRegistrationForm({
  onSubmit,
  onCancel,
  initialData,
}: MemberRegistrationFormProps) {
  const [formData, setFormData] = useState({
    family_name: initialData?.family_name || "",
    individual_names: initialData?.individual_names || "",
    marital_status: initialData?.marital_status || "",
    number_of_children: initialData?.number_of_children || 0,
    contact_number: initialData?.contact_number || "",
    contact_address: initialData?.contact_address || "",
    foundation_class_date: initialData?.foundation_class_date || "",
    baptism_water: initialData?.baptism_water || false,
    baptism_holy_ghost: initialData?.baptism_holy_ghost || false,
    baptism_year: initialData?.baptism_year || "",
    wofbi_class_type: initialData?.wofbi_class_type || "",
    wofbi_year: initialData?.wofbi_year || "",
    joining_location: initialData?.joining_location || "",
    member_type: initialData?.member_type || "individual",
    profile_photo: initialData?.profile_photo || "",
    church_group: initialData?.church_group || "",
    customLocation: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      joining_location:
        formData.joining_location === "other"
          ? formData.customLocation
          : formData.joining_location,
    };
    delete submissionData.customLocation;
    await onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ProfilePhotoUpload
        profilePhoto={formData.profile_photo}
        familyName={formData.family_name}
        onPhotoChange={(photo) =>
          setFormData((prev) => ({ ...prev, profile_photo: photo }))
        }
      />

      <MemberTypeSelection
        memberType={formData.member_type}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, member_type: value }))
        }
      />

      <PersonalInfoSection
        familyName={formData.family_name}
        individualNames={formData.individual_names}
        maritalStatus={formData.marital_status}
        numberOfChildren={formData.number_of_children}
        onChange={handleInputChange}
      />

      <ContactInfoSection
        contactNumber={formData.contact_number}
        contactAddress={formData.contact_address}
        onChange={handleInputChange}
      />

      <ChurchDatesSection
        foundationClassDate={formData.foundation_class_date}
        onChange={handleInputChange}
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

      <WofbiSection
        wofbiClass={{
          type: formData.wofbi_class_type,
          year: formData.wofbi_year,
        }}
        onChange={(wofbiClass) =>
          setFormData((prev) => ({
            ...prev,
            wofbi_class_type: wofbiClass.type,
            wofbi_year: wofbiClass.year,
          }))
        }
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

      <ChurchGroupSection
        churchGroup={formData.church_group || ""}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, church_group: value }))
        }
      />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Member" : "Register Member"}
        </Button>
      </div>
    </form>
  );
}