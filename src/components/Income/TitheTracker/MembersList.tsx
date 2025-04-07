
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Member = {
  id: string;
  family_name: string;
  individual_names: string;
  contact_number?: string;
};

interface MembersListProps {
  members: Member[];
  selectedMemberId: string | null;
  onSelectMember: (memberId: string) => void;
}

export function MembersList({ members, selectedMemberId, onSelectMember }: MembersListProps) {
  if (members.length === 0) return null;
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member Name</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow 
              key={member.id}
              className={selectedMemberId === member.id ? "bg-muted/50" : ""}
            >
              <TableCell>{member.family_name} {member.individual_names}</TableCell>
              <TableCell>{member.contact_number || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onSelectMember(member.id)}
                >
                  View Tithes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
