
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
        
        const memberTithes = await response.json();
        
        // Convert to Tithe type
        const formattedTithes: Tithe[] = memberTithes.map((income: any) => ({
          id: income.id,
          member_id: income.member_id,
          date: income.date,
          amount: parseFloat(income.amount),
          service_type: income.service_type
        }));
        
        setTithes(formattedTithes);
      } else {
        // For web, use Supabase with simpler query structure to avoid type errors
        try {
          const { data, error } = await supabase
            .from('incomes')
            .select('*')
            .eq('category', 'tithe')
            .eq('member_id', memberId)
            .order('date', { ascending: false });
          
          if (error) {
            console.error('Error fetching tithes:', error);
            setTithes([]);
            return;
          }
          
          // Map the data to match the Tithe type
          const formattedTithes = (data || []).map(item => ({
            id: item.id,
            member_id: memberId, // Use the passed memberId since we filtered by it
            date: item.date,
            amount: Number(item.amount),
            service_type: item.service_type
          }));
          
          setTithes(formattedTithes);
        } catch (supabaseError) {
          console.error('Error in Supabase query:', supabaseError);
          setTithes([]);
        }
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
