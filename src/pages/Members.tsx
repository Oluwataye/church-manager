import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MemberRegistrationForm } from "@/components/Members/MemberRegistrationForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { generateMemberProfile } from "@/utils/pdfGenerator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberSearch } from "@/components/Members/MemberSearch";
import { MemberTable } from "@/components/Members/MemberTable";
import { DeleteMemberDialog } from "@/components/Members/DeleteMemberDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

      return data.map((member) => ({
        ...member,
        marital_status: member.marital_status || '',
        number_of_children: member.number_of_children || 0,
        foundation_class_date: member.foundation_class_date || '',
        baptism_water: member.baptism_water || false,
        baptism_holy_ghost: member.baptism_holy_ghost || false,
        baptism_year: member.baptism_year || '',
        wofbi_class_type: member.wofbi_class_type || '',
        wofbi_year: member.wofbi_year || '',
        joining_location: member.joining_location || '',
        member_type: member.member_type || 'individual',
      })) as Member[];
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

  const handleUpdateMember = async (memberData: Omit<Member, "id">) => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from('members')
        .update(memberData)
        .eq('id', selectedMember.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['members'] });
      setShowEditForm(false);
      setSelectedMember(null);
      toast({
        title: "Success!",
        description: "Member has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', selectedMember.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['members'] });
      setShowDeleteDialog(false);
      setSelectedMember(null);
      toast({
        title: "Success!",
        description: "Member has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete member. Please try again.",
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
          <MemberSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <Card className="p-6">
            <MemberTable
              members={filteredMembers}
              onEdit={(member) => {
                setSelectedMember({
                  ...member,
                  marital_status: member.marital_status || '',
                  number_of_children: member.number_of_children || 0,
                  foundation_class_date: member.foundation_class_date || '',
                  baptism_water: member.baptism_water || false,
                  baptism_holy_ghost: member.baptism_holy_ghost || false,
                  baptism_year: member.baptism_year || '',
                  wofbi_class_type: member.wofbi_class_type || '',
                  wofbi_year: member.wofbi_year || '',
                  joining_location: member.joining_location || '',
                  member_type: member.member_type || 'individual',
                });
                setShowEditForm(true);
              }}
              onDelete={(member) => {
                setSelectedMember({
                  ...member,
                  marital_status: member.marital_status || '',
                  number_of_children: member.number_of_children || 0,
                  foundation_class_date: member.foundation_class_date || '',
                  baptism_water: member.baptism_water || false,
                  baptism_holy_ghost: member.baptism_holy_ghost || false,
                  baptism_year: member.baptism_year || '',
                  wofbi_class_type: member.wofbi_class_type || '',
                  wofbi_year: member.wofbi_year || '',
                  joining_location: member.joining_location || '',
                  member_type: member.member_type || 'individual',
                });
                setShowDeleteDialog(true);
              }}
              onDownload={handleDownloadProfile}
            />
          </Card>
        </>
      )}

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-8rem)]">
            {selectedMember && (
              <MemberRegistrationForm
                onSubmit={handleUpdateMember}
                onCancel={() => {
                  setShowEditForm(false);
                  setSelectedMember(null);
                }}
                initialData={selectedMember}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DeleteMemberDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteMember}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedMember(null);
        }}
      />
    </div>
  );
}
