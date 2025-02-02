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
    adultMen: 60,
    adultWomen: 75,
    boys: 15,
    girls: 10,
    total: 160,
  },
  {
    id: 2,
    date: "2024-02-08",
    serviceType: "Sunday Service",
    adultMen: 65,
    adultWomen: 70,
    boys: 18,
    girls: 12,
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
              <TableHead>Adult Men</TableHead>
              <TableHead>Adult Women</TableHead>
              <TableHead>Boys</TableHead>
              <TableHead>Girls</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAttendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.serviceType}</TableCell>
                <TableCell>{record.adultMen}</TableCell>
                <TableCell>{record.adultWomen}</TableCell>
                <TableCell>{record.boys}</TableCell>
                <TableCell>{record.girls}</TableCell>
                <TableCell>{record.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}