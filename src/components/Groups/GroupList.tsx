import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface GroupListProps {
  searchQuery: string;
}

export const GroupList = ({ searchQuery }: GroupListProps) => {
  // Mock data - in a real app, this would come from your backend
  const groups = [
    {
      id: 1,
      name: "Youth Fellowship",
      description: "Group for young adults aged 18-30",
      memberCount: 25,
    },
    {
      id: 2,
      name: "Choir",
      description: "Church choir and music ministry",
      memberCount: 15,
    },
  ];

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <p className="text-sm text-church-600 mt-2">
                {group.memberCount} members
              </p>
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