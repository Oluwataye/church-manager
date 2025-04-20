
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface TitheRecord {
  id: string;
  date: string;
  amount: number;
  month: string;
  notes?: string;
  members: {
    id: string;
    family_name: string;
    individual_names: string;
  };
}

export function MemberTitheHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tithe records with member information using proper type handling
  const { data: titheRecords = [], isLoading, error } = useQuery({
    queryKey: ['memberTithes'],
    queryFn: async () => {
      // Use type assertion for the tithes table but handle it more safely
      const { data, error } = await supabase
        .from('tithes' as any)
        .select(`
          id,
          date,
          amount,
          month,
          notes,
          members:member_id (
            id, 
            family_name, 
            individual_names
          )
        `)
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error fetching tithe records:", error);
        throw error;
      }

      // First cast to unknown and then to our expected type
      return (data as unknown) as TitheRecord[];
    },
    onError: (error) => {
      toast.error("Failed to load tithe records. Please try again.");
      console.error("Tithe records error:", error);
      return [];
    },
  });

  // Filter records based on search term
  const filteredRecords = titheRecords?.filter(record => {
    if (!record.members) return false; // Skip records with missing member data
    
    const memberName = `${record.members.family_name} ${record.members.individual_names}`.toLowerCase();
    return memberName.includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Loading records...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-destructive">Error loading records. Please try again.</TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">No tithe records found</TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.members ? 
                        `${record.members.family_name} ${record.members.individual_names}` : 
                        "Unknown member"}
                    </TableCell>
                    <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                    <TableCell className="capitalize">{record.month}</TableCell>
                    <TableCell className="text-right">
                      ₦{typeof record.amount === 'number' 
                        ? record.amount.toLocaleString() 
                        : parseFloat(String(record.amount)).toLocaleString()}
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
