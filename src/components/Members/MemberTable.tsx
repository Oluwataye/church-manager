import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MemberTableRow } from "./MemberTableRow";

interface Member {
  id: string;
  family_name: string;
  individual_names: string;
  contact_number: string;
  contact_address: string;
  church_group?: string;
  profile_photo?: string;
  member_type: string;
}

interface MemberTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onDownload: (member: Member) => void;
}

export function MemberTable({
  members,
  onEdit,
  onDelete,
  onDownload,
}: MemberTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profile</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Group</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <MemberTableRow
            key={member.id}
            member={member}
            onEdit={onEdit}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        ))}
      </TableBody>
    </Table>
  );
}