import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function AttendanceList() {
  const { data: attendanceRecords = [], isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading attendance records...</p>
        ) : attendanceRecords.length === 0 ? (
          <p className="text-muted-foreground">No attendance records yet. Create your first record!</p>
        ) : (
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
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{record.service_type}</TableCell>
                  <TableCell>{record.adult_men}</TableCell>
                  <TableCell>{record.adult_women}</TableCell>
                  <TableCell>{record.boys}</TableCell>
                  <TableCell>{record.girls}</TableCell>
                  <TableCell className="font-semibold">{record.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}