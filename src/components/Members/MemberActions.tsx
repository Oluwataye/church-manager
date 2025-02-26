
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Member } from "@/hooks/useMembers";

export function useMemberActions() {
  const queryClient = useQueryClient();

  const handleAddMember = async (memberData: Omit<Member, "id">) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['members'] });
      toast("Member has been registered successfully");
      return true;
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error("Failed to register member. Please try again.");
      return false;
    }
  };

  const handleUpdateMember = async (id: string, memberData: Omit<Member, "id">) => {
    try {
      const { error } = await supabase
        .from('members')
        .update(memberData)
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['members'] });
      toast("Member has been updated successfully");
      return true;
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast.error("Failed to update member. Please try again.");
      return false;
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['members'] });
      toast("Member has been deleted successfully");
      return true;
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error("Failed to delete member. Please try again.");
      return false;
    }
  };

  return {
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
  };
}
