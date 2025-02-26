
import { Button } from "@/components/ui/button";

interface MembersHeaderProps {
  onAddMember: () => void;
}

export function MembersHeader({ onAddMember }: MembersHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-church-600">Church Members</h1>
      <Button onClick={onAddMember}>Add New Member</Button>
    </div>
  );
}
