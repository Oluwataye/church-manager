import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AttendanceStats() {
  const { data: attendanceRecords = [] } = useQuery({
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

  const lastRecord = attendanceRecords[0];
  const avgAttendance = attendanceRecords.length > 0
    ? Math.round(attendanceRecords.reduce((sum, r) => sum + (r.total || 0), 0) / attendanceRecords.length)
    : 0;
  
  const avgMen = attendanceRecords.length > 0
    ? Math.round(attendanceRecords.reduce((sum, r) => sum + r.adult_men, 0) / attendanceRecords.length)
    : 0;
  const avgWomen = attendanceRecords.length > 0
    ? Math.round(attendanceRecords.reduce((sum, r) => sum + r.adult_women, 0) / attendanceRecords.length)
    : 0;
  const avgChildren = attendanceRecords.length > 0
    ? Math.round(attendanceRecords.reduce((sum, r) => sum + r.boys + r.girls, 0) / attendanceRecords.length)
    : 0;

  // Calculate growth rate (last record vs previous)
  const growthRate = attendanceRecords.length >= 2
    ? (((attendanceRecords[0].total || 0) - (attendanceRecords[1].total || 0)) / (attendanceRecords[1].total || 1)) * 100
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Service</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lastRecord?.total || 0}</div>
          {lastRecord && (
            <div className="text-xs text-muted-foreground mt-1">
              <p>Men: {lastRecord.adult_men} | Women: {lastRecord.adult_women}</p>
              <p>Children: {lastRecord.boys + lastRecord.girls}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgAttendance}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <p>Men: {avgMen} | Women: {avgWomen}</p>
            <p>Children: {avgChildren}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">vs last service</p>
        </CardContent>
      </Card>
    </div>
  );
}