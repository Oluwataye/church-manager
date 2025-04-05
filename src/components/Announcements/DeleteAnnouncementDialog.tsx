
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DeleteAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcementId: string;
  onSuccess: () => void;
}

export function DeleteAnnouncementDialog({
  open,
  onOpenChange,
  announcementId,
  onSuccess,
}: DeleteAnnouncementDialogProps) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announcementId);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Announcement Deleted",
        description: "The announcement has been deleted successfully."
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Failed to delete the announcement. Please try again."
      });
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this announcement? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
