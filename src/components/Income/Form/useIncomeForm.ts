
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IncomeFormValues, incomeFormSchema } from "./incomeFormSchema";

export function useIncomeForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      description: "",
    },
  });

  const { mutate: saveIncome, isPending } = useMutation({
    mutationFn: async (values: IncomeFormValues) => {
      const formattedDate = format(values.date, "yyyy-MM-dd");

      const { data, error } = await supabase.from('incomes').insert({
        date: formattedDate,
        service_type: values.serviceType,
        category: values.category,
        amount: parseFloat(values.amount),
        description: values.description,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Income recorded successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
    onError: (error) => {
      console.error('Error saving income:', error);
      toast.error("Failed to record income. Please try again.");
    },
  });

  function onSubmit(values: IncomeFormValues) {
    saveIncome(values);
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending
  };
}
