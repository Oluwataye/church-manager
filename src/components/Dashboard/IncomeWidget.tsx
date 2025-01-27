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
  { category: "Tithe", amount: 250000 },
  { category: "Offering", amount: 180000 },
  { category: "Project", amount: 320000 },
  { category: "Special", amount: 150000 },
];

const chartConfig = {
  income: {
    color: "#2563eb",
  },
};

export function IncomeWidget() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Income Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="amount"
                fill="var(--color-income)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}