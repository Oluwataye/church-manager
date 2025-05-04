
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthContext";
import { useState, useEffect } from "react";

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
  group_name?: string; // Add this field for the group name
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
