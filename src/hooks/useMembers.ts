
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  group_name?: string;
}

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          groups:church_group (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        toast.error("Failed to fetch members. Please try again.");
        return [];
      }

      return data.map((member) => ({
        ...member,
        group_name: member.groups?.name,
        marital_status: member.marital_status || '',
        number_of_children: member.number_of_children || 0,
        foundation_class_date: member.foundation_class_date || '',
        baptism_water: member.baptism_water || false,
        baptism_holy_ghost: member.baptism_holy_ghost || false,
        baptism_year: member.baptism_year || '',
        wofbi_class_type: member.wofbi_class_type || '',
        wofbi_year: member.wofbi_year || '',
        joining_location: member.joining_location || '',
        member_type: member.member_type || 'individual',
      })) as Member[];
    },
  });
}
