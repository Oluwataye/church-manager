
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import type { Member } from "@/hooks/useMembers";
import { useAuth } from "@/components/Auth/AuthContext";
import { auditMemberOperation } from "@/utils/auditLog";

export function useMemberActions() {
  const queryClient = useQueryClient();
  const { isOffline } = useAuth();

  // Get members from local storage
  const getLocalMembers = (): Member[] => {
    try {
      const localMembers = localStorage.getItem('localMembers');
      return localMembers ? JSON.parse(localMembers) : [];
    } catch (error) {
      console.error('Error reading local members:', error);
      return [];
    }
  };

  // Save members to local storage
  const saveLocalMembers = (members: Member[]) => {
    try {
      localStorage.setItem('localMembers', JSON.stringify(members));
    } catch (error) {
      console.error('Error saving local members:', error);
      throw new Error('Failed to save member data locally. Please try again.');
    }
  };

  // Create a pending sync operation to be processed when back online
  const createPendingSync = (operation: string, data: any) => {
    try {
      const pendingSync = JSON.parse(localStorage.getItem('pendingSync') || '[]');
      pendingSync.push({ operation, data, timestamp: new Date().toISOString() });
      localStorage.setItem('pendingSync', JSON.stringify(pendingSync));
    } catch (error) {
      console.error('Error creating pending sync:', error);
    }
  };

  // Get group name for a member from local storage when adding/updating
  const getGroupName = async (groupId: string | null): Promise<string | null> => {
    if (!groupId) return null;
    
    try {
      // First check if we can get it from local storage
      const localGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const localGroup = localGroups.find((g: any) => g.id === groupId);
      
      if (localGroup) return localGroup.name;
      
      // If not found locally and we're online, fetch from Supabase
      if (!isOffline) {
        const { data, error } = await supabase
          .from('groups')
          .select('name')
          .eq('id', groupId)
          .single();
          
        if (error) throw error;
        return data?.name || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting group name:', error);
      return null;
    }
  };

  const handleAddMember = async (memberData: Omit<Member, "id">) => {
    try {
      // Get group name for the new member
      const groupName = await getGroupName(memberData.church_group as string);
      console.log("Adding member with group:", memberData.church_group, "group name:", groupName);
      
      // Generate an ID for offline mode
      const newMember = {
        ...memberData,
        id: uuidv4(),
        group_name: groupName
      } as Member;
      
      if (!isOffline) {
        // If online, try to save to Supabase
        try {
          const { data, error } = await supabase
            .from('members')
            .insert([memberData])
            .select()
            .single();

          if (error) throw error;
          
          // Use the server-generated ID
          newMember.id = data.id;
          
          // Audit member creation
          await auditMemberOperation('create', data.id, undefined, {
            first_name: memberData.first_name,
            last_name: memberData.last_name,
            email: memberData.email,
            member_type: memberData.member_type,
          });
        } catch (error) {
          console.error('Supabase error, falling back to offline mode:', error);
          // Continue with offline storage
          createPendingSync('insert', newMember);
        }
      } else {
        // Queue for sync when online
        createPendingSync('insert', newMember);
      }

      // Always update local storage
      const localMembers = getLocalMembers();
      localMembers.push(newMember);
      saveLocalMembers(localMembers);

      // Update UI
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success("Member registered", {
        description: "Member has been registered successfully" + (isOffline ? " (offline mode)" : ""),
        duration: 4000, // 4 seconds duration
      });
      return true;
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error("Registration failed", {
        description: "Failed to register member. Please try again.",
        duration: 4000, // 4 seconds duration
      });
      return false;
    }
  };

  const handleUpdateMember = async (id: string, memberData: Omit<Member, "id">) => {
    try {
      // Get updated group name
      const groupName = await getGroupName(memberData.church_group as string);
      console.log("Updating member with group:", memberData.church_group, "group name:", groupName);
      
      const updatedMember = {
        ...memberData,
        id,
        group_name: groupName
      } as Member;
      
      if (!isOffline) {
        // If online, try to update in Supabase
        try {
          // Get old data for audit
          const { data: oldData } = await supabase
            .from('members')
            .select('first_name, last_name, email, member_type')
            .eq('id', id)
            .single();

          const { error } = await supabase
            .from('members')
            .update(memberData)
            .eq('id', id);

          if (error) throw error;
          
          // Audit member update
          await auditMemberOperation('update', id, oldData, {
            first_name: memberData.first_name,
            last_name: memberData.last_name,
            email: memberData.email,
            member_type: memberData.member_type,
          });
        } catch (error) {
          console.error('Supabase error, falling back to offline mode:', error);
          createPendingSync('update', updatedMember);
        }
      } else {
        // Queue for sync when online
        createPendingSync('update', updatedMember);
      }

      // Always update local storage
      const localMembers = getLocalMembers();
      const updatedMembers = localMembers.map(member => 
        member.id === id ? updatedMember : member
      );
      saveLocalMembers(updatedMembers);

      // Update UI
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success("Member updated", {
        description: "Member has been updated successfully" + (isOffline ? " (offline mode)" : ""),
        duration: 4000, // 4 seconds duration
      });
      return true;
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast.error("Update failed", {
        description: "Failed to update member. Please try again.",
        duration: 4000, // 4 seconds duration
      });
      return false;
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      if (!isOffline) {
        try {
          // Get member data for audit before deletion
          const { data: memberData } = await supabase
            .from('members')
            .select('first_name, last_name, email')
            .eq('id', id)
            .single();

          const { error } = await supabase
            .from('members')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          // Audit member deletion
          await auditMemberOperation('delete', id, memberData, undefined);
        } catch (error) {
          console.error('Supabase error, falling back to offline mode:', error);
          createPendingSync('delete', { id });
        }
      } else {
        createPendingSync('delete', { id });
      }

      // Always update local storage
      const localMembers = getLocalMembers();
      const updatedMembers = localMembers.filter(member => member.id !== id);
      saveLocalMembers(updatedMembers);

      // Update UI
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success("Member deleted", {
        description: "Member has been deleted successfully" + (isOffline ? " (offline mode)" : ""),
        duration: 4000, // 4 seconds duration
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error("Deletion failed", {
        description: "Failed to delete member. Please try again.",
        duration: 4000, // 4 seconds duration
      });
      return false;
    }
  };

  return {
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
  };
}
