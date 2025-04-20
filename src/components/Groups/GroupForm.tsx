
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/Auth/AuthContext";

const groupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

export const GroupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate: saveGroup } = useMutation({
    mutationFn: async (data: GroupFormData) => {
      setIsSubmitting(true);
      try {
        if (!session) {
          throw new Error("Authentication required to create a group");
        }
        
        const { data: result, error } = await supabase
          .from('groups')
          .insert([{
            name: data.name,
            description: data.description,
          }]);
          
        if (error) {
          console.error('Supabase error details:', error);
          throw error;
        }
        return result;
      } catch (error) {
        console.error('Error creating group:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast.success("Group created successfully", {
        description: "The new group has been created and saved."
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      let errorMessage = "There was an error creating the group. Please try again.";
      
      // Check for specific error types
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message: string, code?: string };
        
        if (errorObj.code === '42501') {
          errorMessage = "Permission denied. You might not have the right access to create groups.";
        } else if (errorObj.message.includes('authentication')) {
          errorMessage = "You need to be logged in to create a group.";
        }
      }
      
      toast.error("Failed to create group", {
        description: errorMessage
      });
    },
  });

  const onSubmit = async (data: GroupFormData) => {
    saveGroup(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter group description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Group"}
        </Button>
      </form>
    </Form>
  );
};
