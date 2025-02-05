
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { MemberRegistrationForm } from "@/components/Members/MemberRegistrationForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { generateMemberProfile } from "@/utils/pdfGenerator";

interface Member {
  id: string;
  family_name: string;
  individual_names: string;
  marital_status: string;
  number_of_children: number;
  foundation_class_date: string;
  baptism_water: boolean;
  baptism_holy_ghost: boolean;
  baptism_year: string;
  wofbi_class_type: string;
  wofbi_year: string;
  joining_location: string;
  profile_photo?: string;
  church_group?: string;
  contact_number: string;
  contact_address: string;
}

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to fetch members. Please try again.",
          variant: "destructive",
        });
        return [];
      }

      return data as Member[];
    },
  });

  const filteredMembers = members.filter(
    (member) =>
      member.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.individual_names.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = async (memberData: Omit<Member, "id">) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['members'] });
      setShowRegistrationForm(false);
      toast({
        title: "Success!",
        description: "Member has been registered successfully.",
      });
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadProfile = async (member: Member) => {
    try {
      const success = await generateMemberProfile(member);
      if (success) {
        toast({
          title: "Success",
          description: "Profile downloaded successfully.",
        });
      }
    } catch (error) {
      console.error('Error downloading profile:', error);
      toast({
        title: "Error",
        description: "Failed to download profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-church-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-church-600">Church Members</h1>
        <Button onClick={() => setShowRegistrationForm(true)}>
          Add New Member
        </Button>
      </div>

      {showRegistrationForm ? (
        <Card className="p-6">
          <MemberRegistrationForm
            onSubmit={handleAddMember}
            onCancel={() => setShowRegistrationForm(false)}
          />
        </Card>
      ) : (
        <>
          <div className="max-w-md">
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <Card key={member.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-church-100 rounded-full flex items-center justify-center">
                        {member.profile_photo ? (
                          <img
                            src={member.profile_photo}
                            alt={member.family_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl text-church-600">
                            {member.family_name[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.family_name}</h3>
                        <p className="text-sm text-gray-500">
                          {member.individual_names}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleDownloadProfile(member)}
                    >
                      Download Profile
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No members found
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
