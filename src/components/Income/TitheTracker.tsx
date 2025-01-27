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

export function TitheTracker() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock tithe data
  const mockTitheData = [
    {
      id: 1,
      memberName: "John Doe",
      date: new Date(),
      amount: 25000,
    },
    // Add more mock data as needed
  ];

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
            {mockTitheData.map((tithe) => (
              <TableRow key={tithe.id}>
                <TableCell>{tithe.memberName}</TableCell>
                <TableCell>{format(tithe.date, "PPP")}</TableCell>
                <TableCell className="text-right">
                  ₦{tithe.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}