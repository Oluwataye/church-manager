
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { date: "Jan 1", men: 50, women: 55, children: 15 },
  { date: "Jan 8", men: 55, women: 60, children: 30 },
  { date: "Jan 15", men: 52, women: 58, children: 25 },
  { date: "Jan 22", men: 58, women: 62, children: 30 },
  { date: "Jan 29", men: 60, women: 65, children: 35 },
  { date: "Feb 5", men: 58, women: 67, children: 30 },
  { date: "Feb 12", men: 62, women: 70, children: 33 },
];

export function AttendanceWidget() {
  const navigate = useNavigate();

  return (
    <Card 
      className="col-span-1 transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer"
      onClick={() => navigate("/attendance")}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Attendance</span>
          <span className="text-sm text-muted-foreground">Click to view details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="men"
              name="Men"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="women"
              name="Women"
              stroke="hsl(var(--chart-4))"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="children"
              name="Children"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
