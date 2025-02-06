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
  Legend,
} from "recharts";

const data = [
  { date: "Jan 1", men: 50, women: 55, children: 15 },
  { date: "Jan 8", men: 55, women: 60, children: 30 },
  { date: "Jan 15", men: 52, women: 58, children: 25 },
  { date: "Jan 22", men: 58, women: 62, children: 30 },
  { date: "Jan 29", men: 60, women: 65, children: 35 },
  { date: "Feb 5", men: 58, women: 67, children: 30 },
  { date: "Feb 12", men: 62, women: 70, children: 33 },
];

const chartConfig = {
  men: { color: "#2563eb" },
  women: { color: "#db2777" },
  children: { color: "#16a34a" },
};

export function AttendanceChart() {
  return (
    <Card className="col-span-4 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Attendance</span>
          <span className="text-sm text-muted-foreground">Click to view details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: '10px' }}
              />
              <Line
                type="monotone"
                dataKey="men"
                name="Men"
                stroke="var(--color-men)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="women"
                name="Women"
                stroke="var(--color-women)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="children"
                name="Children"
                stroke="var(--color-children)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}