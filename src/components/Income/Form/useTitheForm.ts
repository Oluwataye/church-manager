
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TitheFormValues, titheFormSchema } from "./titheFormSchema";

export function useTitheForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<TitheFormValues>({
    resolver: zodResolver(titheFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  const { mutate: saveTithe, isPending } = useMutation({
    mutationFn: async (values: TitheFormValues) => {
      const formattedDate = format(values.date, "yyyy-MM-dd");

      // Use casting to work around TypeScript limitations until types are regenerated
      const { data, error } = await supabase
        .from('tithes' as any)
        .insert({
          date: formattedDate,
          member_id: values.memberId,
          amount: parseFloat(values.amount),
          month: values.month,
          notes: values.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Tithe record saved successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['tithes'] });
      queryClient.invalidateQueries({ queryKey: ['memberTithes'] });
    },
    onError: (error) => {
      console.error('Error saving tithe record:', error);
      toast.error("Failed to save tithe record. Please try again.");
    },
  });

  function onSubmit(values: TitheFormValues) {
    saveTithe(values);
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending
  };
}
