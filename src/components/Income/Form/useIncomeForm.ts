
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IncomeFormValues, incomeFormSchema } from "./incomeFormSchema";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function useIncomeForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      description: "",
      date: new Date(),
      serviceType: "sunday", // Provide defaults for all required fields
      category: "offering",
      amount: "",
    },
  });

  const selectedCategory = form.watch("category");

  // We'll add validation conditionally
  useEffect(() => {
    if (selectedCategory === "tithe") {
      form.register("member_id", { 
        required: "Member selection is required for tithe records" 
      });
    }
  }, [selectedCategory, form]);

  const { mutate: saveIncome, isPending } = useMutation({
    mutationFn: async (values: IncomeFormValues) => {
      const formattedDate = format(values.date, "yyyy-MM-dd");
      const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
      
      if (isElectron) {
        // For Electron, use fetch API to local server
        const API_BASE_URL = window.electronAPI?.apiBaseUrl;
        
        const response = await fetch(`${API_BASE_URL}/income`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: formattedDate,
            service_type: values.serviceType,
            category: values.category,
            amount: parseFloat(values.amount),
            description: values.description,
            member_id: values.member_id || null
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save income record');
        }
        
        return await response.json();
      } else {
        // For web, use Supabase
        const { data, error } = await supabase.from('incomes').insert({
          date: formattedDate,
          service_type: values.serviceType,
          category: values.category,
          amount: parseFloat(values.amount),
          description: values.description,
          member_id: values.member_id || null
        }).select().single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Income Recorded",
        description: "Income has been recorded successfully."
      });
      form.reset({
        date: new Date(),
        serviceType: "sunday",
        category: "offering",
        amount: "",
        description: "",
      });
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
    onError: (error) => {
      console.error('Error saving income:', error);
      toast({
        variant: "destructive",
        title: "Record Failed",
        description: "Failed to record income. Please try again."
      });
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
