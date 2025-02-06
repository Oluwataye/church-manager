import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

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

interface MemberTableRowProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onDownload: (member: Member) => void;
}

export function MemberTableRow({
  member,
  onEdit,
  onDelete,
  onDownload,
}: MemberTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="w-12 h-12 bg-church-100 rounded-full flex items-center justify-center">
          {member.profile_photo ? (
            <img
              src={member.profile_photo}
              alt={member.family_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xl text-church-600">
              {member.family_name[0]}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{member.family_name}</p>
          <p className="text-sm text-gray-500">{member.individual_names}</p>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="text-sm">{member.contact_number}</p>
          <p className="text-sm text-gray-500">{member.contact_address}</p>
        </div>
      </TableCell>
      <TableCell>{member.church_group}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownload(member)}>
            Download
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(member)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}