import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeUserInput } from "@/utils/sanitization";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required").max(2000, "Content must be less than 2000 characters"),
  priority: z.enum(["high", "medium", "low"]),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: {
    id: string;
    title: string;
    content: string;
    priority: "high" | "medium" | "low";
  };
  onSuccess: () => void;
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  onSuccess,
}: AnnouncementDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!announcement;

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement?.title || "",
      content: announcement?.content || "",
      priority: announcement?.priority || "medium",
    },
  });

  async function onSubmit(data: AnnouncementFormData) {
    setIsSubmitting(true);
    try {
      // Sanitize inputs
      const sanitizedData = {
        title: sanitizeUserInput(data.title),
        content: sanitizeUserInput(data.content),
        priority: data.priority,
      };

      // Server-side validation
      const { data: validationData, error: validationError } = await supabase.functions.invoke(
        'validate-announcement',
        {
          body: sanitizedData,
        }
      );

      if (validationError || !validationData?.valid) {
        const errors = validationData?.errors || [{ message: 'Validation failed' }];
        throw new Error(errors.map((e: any) => e.message).join(', '));
      }

      if (isEditing && announcement) {
        // Update existing announcement
        const { error } = await supabase
          .from("announcements")
          .update({
            title: sanitizedData.title,
            content: sanitizedData.content,
            priority: sanitizedData.priority,
            updated_at: new Date().toISOString(),
          })
          .eq("id", announcement.id);

        if (error) throw error;
        toast.success("Announcement updated", {
          description: "The announcement has been updated successfully.",
        });
      } else {
        // Create new announcement
        const { error } = await supabase
          .from("announcements")
          .insert({
            title: sanitizedData.title,
            content: sanitizedData.content,
            priority: sanitizedData.priority,
            publish_date: new Date().toISOString(),
          });

        if (error) throw error;
        toast.success("Announcement created", {
          description: "The announcement has been created successfully.",
        });
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Error saving announcement:", error);
      toast.error("Error", {
        description: error.message || "Failed to save the announcement. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Announcement" : "Add Announcement"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter announcement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter announcement content"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Update"
                  : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
