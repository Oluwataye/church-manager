
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateMemberProfile } from "@/utils/pdfGenerator";

interface Member {
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
  group_name?: string; // Add this field for the group name
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
  const handleDownload = async () => {
    try {
      const result = await generateMemberProfile(member);
      if (!result) {
        toast({
          variant: "warning",
          title: "Download Issue",
          description: "There was an issue generating the PDF. Please try again."
        });
      }
      onDownload(member);
    } catch (error) {
      console.error("Error generating profile:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to generate member profile. Please try again."
      });
    }
  };

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
      <TableCell>{member.group_name || 'No Group'}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(member)} title="Edit member">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            title="Download PDF"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(member)}
            title="Delete member"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
