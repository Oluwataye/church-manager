
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface GroupListProps {
  searchQuery: string;
}

export const GroupList = ({ searchQuery }: GroupListProps) => {
  const { data: groups = [], isLoading, error, isError } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching groups:", error);
        throw error;
      }
    },
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (isError && error) {
      toast.error("Failed to load groups", {
        description: "Please try again or contact support if the issue persists."
      });
      console.error("Groups error:", error);
    }
  }, [isError, error]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <p className="text-center">Loading groups...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredGroups.map((group) => (
        <Card key={group.id} className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-church-100 p-2 rounded-lg">
              <Users className="w-6 h-6 text-church-600" />
            </div>
            <div>
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-500">{group.description}</p>
            </div>
          </div>
        </Card>
      ))}
      {filteredGroups.length === 0 && (
        <p className="text-gray-500 col-span-full text-center">No groups found</p>
      )}
    </div>
  );
};
