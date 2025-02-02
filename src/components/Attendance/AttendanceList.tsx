import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockAttendance = [
  {
    id: 1,
    date: "2024-02-01",
    serviceType: "Sunday Service",
    men: 60,
    women: 75,
    children: 25,
    total: 160,
  },
  {
    id: 2,
    date: "2024-02-08",
    serviceType: "Sunday Service",
    men: 65,
    women: 70,
    children: 30,
    total: 165,
  },
];

export function AttendanceList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Men</TableHead>
              <TableHead>Women</TableHead>
              <TableHead>Children</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAttendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.serviceType}</TableCell>
                <TableCell>{record.men}</TableCell>
                <TableCell>{record.women}</TableCell>
                <TableCell>{record.children}</TableCell>
                <TableCell>{record.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}