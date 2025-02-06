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

interface ChurchGroupSectionProps {
  churchGroup: string;
  onChange: (value: string) => void;
}

export function ChurchGroupSection({
  churchGroup,
  onChange,
}: ChurchGroupSectionProps) {
  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="churchGroup">Church Group</Label>
      <Select value={churchGroup} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a church group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}