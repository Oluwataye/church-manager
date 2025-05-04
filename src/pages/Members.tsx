
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
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
import { useAuth } from "@/components/Auth/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Use data, isLoading, isError and refetch from useMembers hook
  const { data: members = [], isLoading, isError, refetch } = useMembers();
  const { handleAddMember, handleUpdateMember, handleDeleteMember } = useMemberActions();
  const { isOffline } = useAuth();

  // Ensure members data is loaded correctly
  useEffect(() => {
    // Attempt to refetch data when the component mounts
    refetch();
    
    // Also retry loading data if we initially get an empty result
    if (members.length === 0 && !isLoading) {
      const retryTimer = setTimeout(() => {
        console.log("No members found initially, retrying fetch...");
        refetch();
      }, 1000); // Wait 1 second before retrying
      
      return () => clearTimeout(retryTimer);
    }
  }, [refetch, members.length, isLoading]);

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.individual_names.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.contact_number && member.contact_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const MEMBERS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE));
  
  // Reset to first page when search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Ensure current page is valid when filtered members change
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  // Get current page members
  const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + MEMBERS_PER_PAGE);

  const handleDownloadProfile = async (member: Member) => {
    try {
      const success = await generateMemberProfile(member);
      if (success) {
        toast.success("Profile downloaded successfully", {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error downloading profile:', error);
      toast.error("Failed to download profile. Please try again.", {
        duration: 4000,
      });
    }
  };

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
              if (success) {
                setShowRegistrationForm(false);
                toast.success("Member added successfully", {
                  duration: 4000,
                });
              }
            }}
            onCancel={() => setShowRegistrationForm(false)}
          />
        </Card>
      ) : (
        <>
          <MemberSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-church-600" />
            </div>
          ) : isError ? (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error loading members</h3>
              <p className="text-gray-500 mb-4">There was a problem loading member data.</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </Card>
          ) : (
            <Card className="p-6">
              <MemberTable
                members={paginatedMembers}
                onEdit={(member) => {
                  setSelectedMember(member);
                  setShowEditForm(true);
                }}
                onDelete={(member) => {
                  setSelectedMember(member);
                  setShowDeleteDialog(true);
                }}
                onDownload={handleDownloadProfile}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Card>
          )}
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
                    toast.success("Member updated successfully", {
                      duration: 4000,
                    });
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
              toast.success("Member deleted successfully", {
                duration: 4000,
              });
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
