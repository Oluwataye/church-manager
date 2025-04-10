
import { useState } from "react";
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
import { useMemberTithes, Tithe } from "@/hooks/useMemberTithes";

export function TitheTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const { tithes, isLoading } = useMemberTithes();

  // Filter tithes based on search term
  const filteredTithes = tithes.filter(tithe => 
    tithe.memberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search member..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button>Search</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Loading tithe records...</TableCell>
              </TableRow>
            ) : filteredTithes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No tithe records found</TableCell>
              </TableRow>
            ) : (
              filteredTithes.map((tithe) => (
                <TableRow key={tithe.id}>
                  <TableCell>{tithe.memberName}</TableCell>
                  <TableCell>{format(new Date(tithe.date), "PPP")}</TableCell>
                  <TableCell className="text-right">
                    ₦{tithe.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
