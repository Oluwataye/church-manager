
import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { Search, FileDown, Loader2 } from "lucide-react";
import { useMemberTithes } from "@/hooks/useMemberTithes";
import { generateTitheReport } from "@/utils/titheReportGenerator";
import { toast } from "@/hooks/use-toast";

export function TitheTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { 
    members, 
    tithes, 
    isLoading, 
    searchMembers, 
    fetchMemberTithes 
  } = useMemberTithes();

  useEffect(() => {
    // Initial search with empty term loads all members
    searchMembers("");
  }, [searchMembers]);

  const handleSearch = () => {
    searchMembers(searchTerm);
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    fetchMemberTithes(memberId);
  };

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
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4">
        <div className="flex-1 space-y-2">
          <label htmlFor="member-search" className="text-sm font-medium">Search Member</label>
          <div className="flex items-center space-x-2">
            <Input
              id="member-search"
              placeholder="Enter member name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button 
              onClick={handleSearch} 
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              <span>Search</span>
            </Button>
          </div>
        </div>

        <Button
          onClick={handleDownloadReport}
          disabled={!selectedMemberId || tithes.length === 0}
          className="flex items-center"
        >
          <FileDown className="h-4 w-4 mr-2" />
          <span>Download Tithe Report</span>
        </Button>
      </div>

      <div className="space-y-6">
        {members.length > 0 && (
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
                        onClick={() => handleSelectMember(member.id)}
                      >
                        View Tithes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {selectedMemberId && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Tithe Records
              {members.find(m => m.id === selectedMemberId) && 
                ` for ${members.find(m => m.id === selectedMemberId)?.family_name} ${members.find(m => m.id === selectedMemberId)?.individual_names}`
              }
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : tithes.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tithes.map((tithe) => (
                      <TableRow key={tithe.id}>
                        <TableCell>{format(new Date(tithe.date), "PPP")}</TableCell>
                        <TableCell>{tithe.service_type}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₦{tithe.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/30 font-medium">
                      <TableCell colSpan={2} className="text-right">Total:</TableCell>
                      <TableCell className="text-right">
                        ₦{tithes.reduce((sum, tithe) => sum + Number(tithe.amount), 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">No tithe records found for this member</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
