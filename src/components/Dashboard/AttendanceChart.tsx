import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Jan 1", attendance: 120 },
  { date: "Jan 8", attendance: 145 },
  { date: "Jan 15", attendance: 135 },
  { date: "Jan 22", attendance: 150 },
  { date: "Jan 29", attendance: 160 },
  { date: "Feb 5", attendance: 155 },
  { date: "Feb 12", attendance: 165 },
];

const chartConfig = {
  attendance: {
    color: "#2563eb",
  },
};

export function AttendanceChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="var(--color-attendance)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}