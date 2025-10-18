import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Member } from "@/hooks/useMembers";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { nigerianStates, getCitiesByState } from "@/utils/nigerianCities";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";

interface MemberRegistrationFormProps {
  onSubmit: (data: Omit<Member, "id">) => Promise<void>;
  onCancel: () => void;
  initialData?: Member;
}

export function MemberRegistrationForm({ onSubmit, onCancel, initialData }: MemberRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    date_of_birth: initialData?.date_of_birth || "",
    gender: initialData?.gender || "",
    marital_status: initialData?.marital_status || "",
    member_type: initialData?.member_type || "member",
    church_group: initialData?.church_group || "",
    baptism_date: initialData?.baptism_date || "",
    baptism_location: initialData?.baptism_location || "",
    join_date: initialData?.join_date || "",
    wofbi_graduate: initialData?.wofbi_graduate || false,
    wofbi_graduation_year: initialData?.wofbi_graduation_year || undefined,
    wofbi_type: initialData?.wofbi_type || "",
    photo_url: initialData?.photo_url || "",
  });

  const availableCities = formData.state ? getCitiesByState(formData.state) : [];

  // Fetch groups
  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  

  const validateForm = () => {
    if (!formData.first_name?.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.last_name?.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (formData.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (formData.phone && !/^[0-9+\-\(\)\s]{7,20}$/.test(formData.phone)) {
      toast.error("Invalid phone format (7-20 digits, can include +, -, (), spaces)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData as Omit<Member, "id">);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof Member, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic member details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-6">
            <Label>Passport Photo</Label>
            <div className="mt-2">
              <ProfilePhotoUpload
                profilePhoto={formData.photo_url || ""}
                familyName={formData.last_name || ""}
                onPhotoChange={(photo) => updateField("photo_url", photo)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => updateField("date_of_birth", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="marital_status">Marital Status</Label>
            <Select value={formData.marital_status} onValueChange={(value) => updateField("marital_status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How to reach this member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => {
                updateField("state", value);
                updateField("city", ""); // Reset city when state changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Select 
                value={formData.city} 
                onValueChange={(value) => updateField("city", value)}
                disabled={!formData.state}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.state ? "Select city" : "Select state first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.length > 0 ? (
                    availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-cities" disabled>
                      No cities available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Church Information */}
      <Card>
        <CardHeader>
          <CardTitle>Church Information</CardTitle>
          <CardDescription>Membership and group details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="member_type">Member Type</Label>
              <Select value={formData.member_type} onValueChange={(value) => updateField("member_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="minister">Minister</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="church_group">Church Group</Label>
              <Select value={formData.church_group} onValueChange={(value) => updateField("church_group", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="join_date">Join Date</Label>
            <Input
              id="join_date"
              type="date"
              value={formData.join_date}
              onChange={(e) => updateField("join_date", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Baptism Information */}
      <Card>
        <CardHeader>
          <CardTitle>Baptism Information</CardTitle>
          <CardDescription>Baptism details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baptism_date">Baptism Date</Label>
              <Input
                id="baptism_date"
                type="date"
                value={formData.baptism_date}
                onChange={(e) => updateField("baptism_date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="baptism_location">Baptism Location</Label>
              <Input
                id="baptism_location"
                value={formData.baptism_location}
                onChange={(e) => updateField("baptism_location", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WOFBI Information */}
      <Card>
        <CardHeader>
          <CardTitle>WOFBI Information</CardTitle>
          <CardDescription>Word of Faith Bible Institute details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wofbi_type">WOFBI Course Type</Label>
            <Select 
              value={formData.wofbi_type} 
              onValueChange={(value) => {
                updateField("wofbi_type", value);
                if (value === "none" || value === "") {
                  updateField("wofbi_graduate", false);
                  updateField("wofbi_graduation_year", undefined);
                } else {
                  updateField("wofbi_graduate", true);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select WOFBI course type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="BCC">Basic Certificate Course (BCC)</SelectItem>
                <SelectItem value="LCC">Leadership Certificate Course (LCC)</SelectItem>
                <SelectItem value="LDC">Leadership Diploma Course (LDC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.wofbi_type && formData.wofbi_type !== "none" && (
            <div>
              <Label htmlFor="wofbi_graduation_year">Graduation Year</Label>
              <Input
                id="wofbi_graduation_year"
                type="number"
                min="1980"
                max={new Date().getFullYear()}
                value={formData.wofbi_graduation_year || ""}
                onChange={(e) => updateField("wofbi_graduation_year", parseInt(e.target.value) || undefined)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Form Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Member" : "Add Member"}
        </Button>
      </div>
    </form>
  );
}
