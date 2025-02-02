import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", tithe: 250000, offering: 180000, project: 320000, special: 150000 },
  { month: "Feb", tithe: 280000, offering: 190000, project: 300000, special: 160000 },
  { month: "Mar", tithe: 260000, offering: 200000, project: 280000, special: 170000 },
  { month: "Apr", tithe: 290000, offering: 185000, project: 310000, special: 155000 },
  { month: "May", tithe: 270000, offering: 195000, project: 290000, special: 165000 },
  { month: "Jun", tithe: 285000, offering: 175000, project: 330000, special: 145000 },
];

const chartConfig = {
  tithe: { color: "#2563eb" },
  offering: { color: "#16a34a" },
  project: { color: "#d97706" },
  special: { color: "#dc2626" },
};

export function IncomeWidget() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Income Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="tithe"
                name="Tithe"
                stackId="a"
                fill="var(--color-tithe)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="offering"
                name="Offering"
                stackId="a"
                fill="var(--color-offering)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="project"
                name="Project"
                stackId="a"
                fill="var(--color-project)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="special"
                name="Special"
                stackId="a"
                fill="var(--color-special)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}