
import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { MembersHeader } from "@/components/Members/MembersHeader";
import { MemberRegistrationForm } from "@/components/Members/MemberRegistrationForm";
import { useMembers } from "@/hooks/useMembers";
import { useMemberActions } from "@/components/Members/MemberActions";
import type { Member } from "@/hooks/useMembers";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: members = [], isLoading } = useMembers();
  const { handleAddMember, handleUpdateMember, handleDeleteMember } = useMemberActions();
  const { isOffline } = useAuth();

  const filteredMembers = members.filter(
    (member) =>
      member.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.individual_names.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadProfile = async (member: Member) => {
    try {
      const success = await generateMemberProfile(member);
      if (success) {
        toast("Profile downloaded successfully");
      }
    } catch (error) {
      console.error('Error downloading profile:', error);
      toast.error("Failed to download profile. Please try again.");
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
      {isOffline && (
        <Alert variant="warning" className="mb-4">
          <AlertTitle>Offline Mode</AlertTitle>
          <AlertDescription>
            You are currently working offline. Changes will be saved locally and synced when you're back online.
          </AlertDescription>
        </Alert>
      )}
      
      <MembersHeader onAddMember={() => setShowRegistrationForm(true)} />

      {showRegistrationForm ? (
        <Card className="p-6">
          <MemberRegistrationForm
            onSubmit={async (data) => {
              const success = await handleAddMember(data);
              if (success) setShowRegistrationForm(false);
            }}
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
                setSelectedMember(member);
                setShowEditForm(true);
              }}
              onDelete={(member) => {
                setSelectedMember(member);
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
                onSubmit={async (data) => {
                  const success = await handleUpdateMember(selectedMember.id, data);
                  if (success) {
                    setShowEditForm(false);
                    setSelectedMember(null);
                  }
                }}
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
        onConfirm={async () => {
          if (selectedMember) {
            const success = await handleDeleteMember(selectedMember.id);
            if (success) {
              setShowDeleteDialog(false);
              setSelectedMember(null);
            }
          }
        }}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedMember(null);
        }}
      />
    </div>
  );
}

// Import missing components
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
