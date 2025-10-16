
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { exportTithesToCSV, exportMemberTithesToCSV } from "@/utils/titheCsvExport";
import { generateTitheReportPDF, generateMemberTithePDF } from "@/utils/tithePdfGenerator";

interface TitheRecord {
  id: string;
  date: string;
  amount: number;
  month: string;
  notes?: string;
  members: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export function MemberTitheHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tithe records with member information
  const { data: titheRecords = [], isLoading, error, isError } = useQuery<TitheRecord[], Error>({
    queryKey: ['memberTithes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tithes')
          .select(`
            id,
            date,
            amount,
            month,
            notes,
            members:member_id (
              id, 
              first_name, 
              last_name
            )
          `)
          .order('date', { ascending: false });
        
        if (error) {
          console.error("Error fetching tithe records:", error);
          throw error;
        }

        // Return the data with proper type casting
        return (data as unknown) as TitheRecord[];
      } catch (error) {
        console.error("Failed to fetch tithe records:", error);
        throw error;
      }
    },
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (isError && error) {
      toast.error("Failed to load tithe records", {
        description: "Please try again or contact support if the issue persists."
      });
      console.error("Tithe records error:", error);
    }
  }, [isError, error]);

  // Filter records based on search term
  const filteredRecords = titheRecords?.filter(record => {
    if (!record.members) return false;
    
    const memberName = `${record.members.first_name} ${record.members.last_name}`.toLowerCase();
    return memberName.includes(searchTerm.toLowerCase());
  }) || [];

  const handleDownloadAllCSV = () => {
    if (filteredRecords.length === 0) {
      toast.error("No records to download");
      return;
    }
    exportTithesToCSV(filteredRecords);
    toast.success("CSV downloaded successfully");
  };

  const handleDownloadAllPDF = async () => {
    if (filteredRecords.length === 0) {
      toast.error("No records to download");
      return;
    }
    const success = await generateTitheReportPDF(filteredRecords);
    if (success) {
      toast.success("PDF downloaded successfully");
    } else {
      toast.error("Failed to generate PDF");
    }
  };

  const handleDownloadMemberTithes = async (memberId: string, format: 'csv' | 'pdf') => {
    const memberRecords = titheRecords.filter(record => record.members?.id === memberId);
    
    if (memberRecords.length === 0) {
      toast.error("No tithe records found for this member");
      return;
    }

    const memberName = `${memberRecords[0].members.first_name} ${memberRecords[0].members.last_name}`;

    if (format === 'csv') {
      exportMemberTithesToCSV(memberName, memberRecords);
      toast.success("CSV downloaded successfully");
    } else {
      const success = await generateMemberTithePDF(memberName, memberRecords);
      if (success) {
        toast.success("PDF downloaded successfully");
      } else {
        toast.error("Failed to generate PDF");
      }
    }
  };

  // Get unique members from tithe records
  const uniqueMembers = Array.from(
    new Map(
      titheRecords
        .filter(record => record.members)
        .map(record => [record.members.id, record.members])
    ).values()
  );

  const totalAmount = filteredRecords.reduce((sum, record) => sum + Number(record.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDownloadAllCSV}
            variant="outline"
            size="sm"
            disabled={filteredRecords.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            onClick={handleDownloadAllPDF}
            variant="outline"
            size="sm"
            disabled={filteredRecords.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold">{filteredRecords.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">₦{totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Unique Members</p>
            <p className="text-2xl font-bold">{uniqueMembers.length}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">Loading records...</TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-destructive">Error loading records. Please try again.</TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">No tithe records found</TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.members ? 
                        `${record.members.first_name} ${record.members.last_name}` : 
                        "Unknown member"}
                    </TableCell>
                    <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                    <TableCell className="capitalize">{record.month}</TableCell>
                    <TableCell className="text-right">
                      ₦{typeof record.amount === 'number' 
                        ? record.amount.toLocaleString() 
                        : parseFloat(String(record.amount)).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadMemberTithes(record.members.id, 'csv')}
                          title="Download member's tithe records (CSV)"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadMemberTithes(record.members.id, 'pdf')}
                          title="Download member's tithe records (PDF)"
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
