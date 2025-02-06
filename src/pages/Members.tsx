import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MemberRegistrationForm } from "@/components/Members/MemberRegistrationForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { generateMemberProfile } from "@/utils/pdfGenerator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <div className="max-w-md">
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="w-12 h-12 bg-church-100 rounded-full flex items-center justify-center">
                        {member.profile_photo ? (
                          <img
                            src={member.profile_photo}
                            alt={member.family_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl text-church-600">
                            {member.family_name[0]}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.family_name}</p>
                        <p className="text-sm text-gray-500">
                          {member.individual_names}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{member.contact_number}</p>
                        <p className="text-sm text-gray-500">
                          {member.contact_address}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{member.church_group}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(member);
                            setShowEditForm(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadProfile(member)}
                        >
                          Download
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(member);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member's
              profile and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setSelectedMember(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}