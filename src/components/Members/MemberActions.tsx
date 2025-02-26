
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
      toast({
        title: "Success!",
        description: "Member has been registered successfully.",
      });
      return true;
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register member. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Success!",
        description: "Member has been updated successfully.",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Success!",
        description: "Member has been deleted successfully.",
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete member. Please try again.",
        variant: "destructive",
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
