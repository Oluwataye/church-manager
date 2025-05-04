
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/components/Groups/GroupList";
import { useEffect } from "react";

interface ChurchGroupSectionProps {
  churchGroup: string;
  onChange: (value: string) => void;
}

export function ChurchGroupSection({
  churchGroup,
  onChange,
}: ChurchGroupSectionProps) {
  const { data: groups = [], isLoading, isError, refetch } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching groups:", error);
          throw error;
        }
        
        // Save groups to local storage for offline access
        if (data) {
          localStorage.setItem('groups', JSON.stringify(data));
        }
        
        console.log("Fetched groups:", data);
        return data || [];
      } catch (error) {
        console.error("Error fetching groups:", error);
        
        // Try to get groups from localStorage if online fetch fails
        const localGroups = localStorage.getItem('groups');
        if (localGroups) {
          return JSON.parse(localGroups);
        }
        
        return [];
      }
    },
  });

  // Refetch groups when component mounts to ensure latest data
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-2">
      <Label htmlFor="churchGroup">Church Group</Label>
      <Select value={churchGroup} onValueChange={onChange}>
        <SelectTrigger id="churchGroup" className="w-full">
          <SelectValue placeholder="Select a church group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {groups && groups.length > 0 ? (
            groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-groups" disabled>
              {isLoading ? "Loading groups..." : "No groups available"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {isError && (
        <p className="text-sm text-red-500">
          Error loading groups. Please try again.
        </p>
      )}
    </div>
  );
}
