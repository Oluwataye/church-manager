import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const mockData = [
  {
    id: 1,
    date: new Date(),
    serviceType: "Sunday Service",
    category: "Tithe",
    amount: 50000,
    description: "Weekly tithe collection",
  },
  // Add more mock data as needed
];

export function IncomeList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{format(item.date, "PPP")}</TableCell>
              <TableCell>{item.serviceType}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">₦{item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}