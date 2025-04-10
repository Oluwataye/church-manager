
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import type { Member } from "@/hooks/useMembers";
import { useAuth } from "@/components/Auth/AuthContext";

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

  const handleAddMember = async (memberData: Omit<Member, "id">) => {
    try {
      // Generate an ID for offline mode
      const newMember = { ...memberData, id: uuidv4() } as Member;
      
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
        description: "Member has been registered successfully" + (isOffline ? " (offline mode)" : "")
      });
      return true;
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error("Registration failed", {
        description: "Failed to register member. Please try again."
      });
      return false;
    }
  };

  const handleUpdateMember = async (id: string, memberData: Omit<Member, "id">) => {
    try {
      const updatedMember = { ...memberData, id } as Member;
      
      if (!isOffline) {
        // If online, try to update in Supabase
        try {
          const { error } = await supabase
            .from('members')
            .update(memberData)
            .eq('id', id);

          if (error) throw error;
        } catch (error) {
          console.error('Supabase error, falling back to offline mode:', error);
          // Continue with offline storage
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
        description: "Member has been updated successfully" + (isOffline ? " (offline mode)" : "")
      });
      return true;
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast.error("Update failed", {
        description: "Failed to update member. Please try again."
      });
      return false;
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      if (!isOffline) {
        // If online, try to delete from Supabase
        try {
          const { error } = await supabase
            .from('members')
            .delete()
            .eq('id', id);

          if (error) throw error;
        } catch (error) {
          console.error('Supabase error, falling back to offline mode:', error);
          // Continue with offline storage
          createPendingSync('delete', { id });
        }
      } else {
        // Queue for sync when online
        createPendingSync('delete', { id });
      }

      // Always update local storage
      const localMembers = getLocalMembers();
      const updatedMembers = localMembers.filter(member => member.id !== id);
      saveLocalMembers(updatedMembers);

      // Update UI
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success("Member deleted", {
        description: "Member has been deleted successfully" + (isOffline ? " (offline mode)" : "")
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error("Deletion failed", {
        description: "Failed to delete member. Please try again."
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
