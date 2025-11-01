
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { month: "Jan", tithe: 250000, offering: 180000, project: 320000, special: 150000 },
  { month: "Feb", tithe: 280000, offering: 190000, project: 300000, special: 160000 },
  { month: "Mar", tithe: 260000, offering: 200000, project: 280000, special: 170000 },
  { month: "Apr", tithe: 290000, offering: 185000, project: 310000, special: 155000 },
  { month: "May", tithe: 270000, offering: 195000, project: 290000, special: 165000 },
  { month: "Jun", tithe: 285000, offering: 175000, project: 330000, special: 145000 },
];

export function IncomeWidget() {
  const navigate = useNavigate();

  return (
    <Card 
      className="col-span-1 transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer"
      onClick={() => navigate("/income")}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Monthly Income Distribution</span>
          <span className="text-sm text-muted-foreground">Click to view details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="tithe"
              name="Tithe"
              stackId="a"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="offering"
              name="Offering"
              stackId="a"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="project"
              name="Project"
              stackId="a"
              fill="hsl(var(--chart-3))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="special"
              name="Special"
              stackId="a"
              fill="hsl(var(--chart-4))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
