import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", amount: 400000 },
  { name: "Feb", amount: 300000 },
  { name: "Mar", amount: 500000 },
  { name: "Apr", amount: 450000 },
  { name: "May", amount: 470000 },
  { name: "Jun", amount: 480000 },
];

const chartConfig = {
  income: {
    color: "#2563eb",
  },
};

export function IncomeChart() {
  return (
    <Card className="p-4">
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
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
      </div>
    </Card>
  );
}