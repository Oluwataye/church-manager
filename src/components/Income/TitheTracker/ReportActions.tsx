
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateTitheReport } from "@/utils/titheReportGenerator";

type Member = {
  id: string;
  family_name: string;
  individual_names: string;
  contact_number?: string;
  contact_address?: string;
};

type Tithe = {
  id: string;
  member_id: string;
  date: string;
  amount: number;
  service_type: string;
};

interface ReportActionsProps {
  selectedMemberId: string | null;
  tithes: Tithe[];
  members: Member[];
}

export function ReportActions({ selectedMemberId, tithes, members }: ReportActionsProps) {
  const handleDownloadReport = async () => {
    if (!selectedMemberId || tithes.length === 0) {
      toast({
        variant: "warning",
        title: "No data available",
        description: "Select a member with tithe records first"
      });
      return;
    }

    const selectedMember = members.find(m => m.id === selectedMemberId);
    if (!selectedMember) return;

    try {
      const success = await generateTitheReport(selectedMember, tithes);
      if (success) {
        toast({
          variant: "success",
          title: "Report Generated",
          description: "Tithe report has been downloaded successfully"
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        variant: "destructive",
        title: "Report Generation Failed",
        description: "Failed to generate tithe report. Please try again."
      });
    }
  };

  return (
    <Button
      onClick={handleDownloadReport}
      disabled={!selectedMemberId || tithes.length === 0}
      className="flex items-center"
    >
      <FileDown className="h-4 w-4 mr-2" />
      <span>Download Tithe Report</span>
    </Button>
  );
}
