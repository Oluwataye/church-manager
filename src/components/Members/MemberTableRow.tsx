import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Download } from "lucide-react";
import type { Member } from "@/hooks/useMembers";

interface MemberTableRowProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onExport: (member: Member) => Promise<void>;
}

export function MemberTableRow({ member, onEdit, onDelete, onExport }: MemberTableRowProps) {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-church-100 flex items-center justify-center overflow-hidden">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.first_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl text-church-600">
                {member.first_name[0]}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium">{member.first_name} {member.last_name}</p>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="capitalize">{member.marital_status || "N/A"}</TableCell>
      <TableCell className="capitalize">{member.gender || "N/A"}</TableCell>
      <TableCell>{member.phone || "N/A"}</TableCell>
      <TableCell className="capitalize">{member.member_type}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(member)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(member)}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExport(member)}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
