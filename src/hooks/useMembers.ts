
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthContext";
import { useState, useEffect } from "react";

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  member_type: string;
  church_group?: string;
  baptism_date?: string;
  baptism_location?: string;
  join_date?: string;
  wofbi_graduate?: boolean;
  wofbi_graduation_year?: number;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
  group_name?: string; // For joined group data
}

export function useMembers() {
  const { isOffline } = useAuth();
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Pre-load local data outside of the query function
  useEffect(() => {
    const localMembers = localStorage.getItem('localMembers');
    if (localMembers) {
      try {
        JSON.parse(localMembers);
        setInitialDataLoaded(true);
      } catch (e) {
        console.error("Error parsing local members data:", e);
      }
    }
  }, []);

  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      console.log("Fetching members data, offline mode:", isOffline);
      
      // First try to get data from local storage
      const localMembers = localStorage.getItem('localMembers');
      const localMembersData = localMembers ? JSON.parse(localMembers) : [];
      
      // If offline, just return local data
      if (isOffline) {
        console.log('Offline mode: returning local members data', localMembersData);
        return localMembersData;
      }
      
      // If online, try to get from Supabase and update local storage
      try {
        // Get members and join with groups to get group names
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (membersError) {
          console.error('Error fetching members from Supabase:', membersError);
          throw membersError;
        }

        // Now fetch all groups to map their names to members
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('id, name');
        
        if (groupsError) {
          console.error('Error fetching groups from Supabase:', groupsError);
          throw groupsError;
        }

        // Create a map of group ids to group names for easy lookup
        const groupMap = new Map();
        groupsData.forEach(group => {
          groupMap.set(group.id, group.name);
        });

        // Add group_name to each member record
        const membersWithGroupNames = membersData.map(member => {
          return {
            ...member,
            group_name: member.church_group ? groupMap.get(member.church_group) : null
          };
        });
        
        console.log('Successfully fetched members from Supabase:', membersWithGroupNames.length);
        
        // Update local storage with the latest data
        localStorage.setItem('localMembers', JSON.stringify(membersWithGroupNames));
        return membersWithGroupNames;
      } catch (error) {
        console.error('Failed to fetch from Supabase, falling back to local data:', error);
        return localMembersData;
      }
    },
    initialData: () => {
      // Return cached data from localStorage on initial load
      const cached = localStorage.getItem('localMembers');
      if (cached) {
        try {
          const parsedData = JSON.parse(cached);
          console.log("Using cached member data from localStorage:", parsedData.length);
          return parsedData;
        } catch (e) {
          console.error("Error parsing cached member data:", e);
          return [];
        }
      }
      return [];
    },
    staleTime: 60000, // Consider data fresh for 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 2, // Retry failed requests twice
  });
}
