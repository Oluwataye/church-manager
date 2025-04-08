
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Move type definitions to the top level to prevent re-calculation
type Member = {
  id: string;
  family_name: string;
  individual_names: string;
  contact_number?: string;
  contact_address?: string;
};

type Tithe = {
  id: string;
  member_id: string;
  date: string;
  amount: number;
  service_type: string;
};

// Create clear interface types
interface IncomeApiResponse {
  id: string;
  member_id: string;
  date: string;
  amount: string | number;
  service_type: string;
}

interface SupabaseTithe {
  id: string;
  date: string;
  amount: string | number;
  service_type: string;
}

export function useMemberTithes() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tithes, setTithes] = useState<Tithe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchMembers = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    try {
      // Check if we're in Electron mode
      const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
      
      if (isElectron) {
        // For Electron, fetch from local API
        const response = await fetch(`${window.electronAPI?.apiBaseUrl}/members`);
        if (!response.ok) throw new Error('Failed to fetch members');
        
        const allMembers = await response.json();
        
        // Filter members based on search term
        const filteredMembers = allMembers.filter((member: Member) => {
          const fullName = `${member.family_name} ${member.individual_names}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        });
        
        setMembers(filteredMembers);
      } else {
        // For web, use Supabase
        let query = supabase.from('members').select('id, family_name, individual_names, contact_number, contact_address');
        
        if (searchTerm) {
          // Fix: Use proper filtering for case-insensitive search
          query = query.or(`family_name.ilike.%${searchTerm}%,individual_names.ilike.%${searchTerm}%`);
        }
        
        const { data, error } = await query.limit(20);
        
        if (error) throw error;
        setMembers(data || []);
      }
    } catch (error) {
      console.error('Error searching members:', error);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMemberTithes = useCallback(async (memberId: string) => {
    setIsLoading(true);
    setTithes([]);
    
    try {
      // Check if we're in Electron mode
      const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
      
      if (isElectron) {
        // For Electron, fetch from local API
        const response = await fetch(`${window.electronAPI?.apiBaseUrl}/income/member/${memberId}`);
        if (!response.ok) throw new Error('Failed to fetch member tithes');
        
        const memberTithes = await response.json() as IncomeApiResponse[];
        
        // Convert to Tithe type with consistent number handling
        const formattedTithes: Tithe[] = memberTithes.map((income: IncomeApiResponse) => ({
          id: income.id,
          member_id: income.member_id,
          date: income.date,
          amount: typeof income.amount === 'string' ? parseFloat(income.amount) : Number(income.amount),
          service_type: income.service_type
        }));
        
        setTithes(formattedTithes);
      } else {
        // For web, use Supabase - simplified query to avoid deep type instantiation
        const result = await supabase
          .from('incomes')
          .select('id, date, amount, service_type')
          .eq('category', 'tithe')
          .eq('member_id', memberId)
          .order('date', { ascending: false });
        
        if (result.error) {
          console.error('Error fetching tithes:', result.error);
          setTithes([]);
          return;
        }
        
        // Explicitly cast data to our defined type to avoid deep instantiation
        const data = result.data as SupabaseTithe[];
        
        // Map data to Tithe type with explicit number conversion for amount
        const formattedTithes: Tithe[] = (data || []).map((item: SupabaseTithe) => ({
          id: item.id,
          member_id: memberId,
          date: item.date,
          // Ensure amount is always a number with consistent conversion approach
          amount: typeof item.amount === 'string' ? parseFloat(item.amount) : Number(item.amount),
          service_type: item.service_type
        }));
        
        setTithes(formattedTithes);
      }
    } catch (error) {
      console.error('Error fetching member tithes:', error);
      setTithes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    members,
    tithes,
    isLoading,
    searchMembers,
    fetchMemberTithes
  };
}
