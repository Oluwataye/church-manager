
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthContext";

export interface Member {
  id: string;
  family_name: string;
  individual_names: string;
  marital_status: string;
  number_of_children: number;
  contact_number: string;
  contact_address: string;
  foundation_class_date: string;
  baptism_water: boolean;
  baptism_holy_ghost: boolean;
  baptism_year: string;
  wofbi_class_type: string;
  wofbi_year: string;
  joining_location: string;
  member_type: string;
  profile_photo?: string;
  church_group?: string;
}

export function useMembers() {
  const { isOffline } = useAuth();

  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      // First try to get data from local storage
      const localMembers = localStorage.getItem('localMembers');
      const localMembersData = localMembers ? JSON.parse(localMembers) : [];
      
      // If offline, just return local data
      if (isOffline) {
        console.log('Offline mode: returning local members data');
        return localMembersData;
      }
      
      // If online, try to get from Supabase and update local storage
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching members from Supabase:', error);
          throw error;
        }
        
        // Update local storage with the latest data
        localStorage.setItem('localMembers', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('Failed to fetch from Supabase, falling back to local data:', error);
        return localMembersData;
      }
    },
    initialData: () => {
      // Return cached data from localStorage on initial load
      const cached = localStorage.getItem('localMembers');
      return cached ? JSON.parse(cached) : [];
    },
  });
}
