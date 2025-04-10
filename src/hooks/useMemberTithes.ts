
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Tithe {
  id: string;
  date: string;
  amount: number;
  service_type: string;
  memberName: string;
}

export function useMemberTithes(memberId?: string) {
  const { data: tithes = [], isLoading } = useQuery({
    queryKey: ['tithes', memberId],
    queryFn: async () => {
      // If searching for a specific member
      if (memberId) {
        const { data, error } = await supabase
          .from('incomes')
          .select(`
            id,
            date,
            amount,
            service_type,
            category
          `)
          .eq('category', 'tithe')
          .order('date', { ascending: false });

        if (error) throw error;
        
        // We'll format the response to match our interface
        return data.map(item => ({
          id: item.id,
          date: item.date,
          amount: parseFloat(item.amount as unknown as string),
          service_type: item.service_type,
          memberName: "John Doe" // Since there's no member_id in incomes table, we use a placeholder
        })) as Tithe[];
      } 
      
      // Default fetch all tithe records
      const { data, error } = await supabase
        .from('incomes')
        .select(`
          id,
          date,
          amount,
          service_type,
          category
        `)
        .eq('category', 'tithe')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // We'll format the response to match our interface
      return data.map(item => ({
        id: item.id,
        date: item.date,
        amount: parseFloat(item.amount as unknown as string),
        service_type: item.service_type,
        memberName: "John Doe" // Since there's no member_id in incomes table, we use a placeholder
      })) as Tithe[];
    },
    enabled: true,
  });

  return {
    tithes,
    isLoading
  };
}
