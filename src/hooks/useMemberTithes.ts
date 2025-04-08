
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define types at top level to prevent TypeScript from recalculating them
interface Member {
  id: string;
  family_name: string;
  individual_names: string;
  contact_number?: string;
  contact_address?: string;
}

interface Tithe {
  id: string;
  member_id: string;
  date: string;
  amount: number;
  service_type: string;
}

// Create a separate interface for Electron API responses
interface ElectronTitheRecord {
  id: string;
  member_id: string;
  date: string;
  amount: string | number;
  service_type: string;
}

// Create a separate interface for Supabase responses - with the fields that actually exist
interface SupabaseTitheRecord {
  id: string;
  date: string;
  amount: string | number;
  service_type: string;
  category: string;
  member_id: string;
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
        
        // Convert to Tithe type with explicit type casting
        const formattedTithes = memberTithes.map((income: ElectronTitheRecord) => ({
          id: income.id,
          member_id: income.member_id,
          date: income.date,
          amount: typeof income.amount === 'string' ? parseFloat(income.amount) : income.amount,
          service_type: income.service_type
        })) as Tithe[];
        
        setTithes(formattedTithes);
      } else {
        // For web, use Supabase with simplified query
        const { data, error } = await supabase
          .from('incomes')
          .select('id, date, amount, service_type, category, member_id')
          .eq('category', 'tithe')
          .eq('member_id', memberId)
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        // Use type assertion to avoid deep type instantiation
        if (data) {
          const formattedTithes = data.map((item) => ({
            id: item.id,
            member_id: item.member_id,
            date: item.date,
            amount: typeof item.amount === 'string' ? parseFloat(item.amount) : Number(item.amount),
            service_type: item.service_type
          }));
          
          setTithes(formattedTithes as Tithe[]);
        } else {
          setTithes([]);
        }
      }
    } catch (error) {
      console.error('Error fetching member tithes:', error);
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
