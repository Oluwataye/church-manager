import { Users, TrendingUp, Church, Calendar } from "lucide-react";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { AttendanceChart } from "@/components/Dashboard/AttendanceChart";
import { IncomeWidget } from "@/components/Dashboard/IncomeWidget";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your church's key metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Members"
          value="150"
          description="+12 from last month"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Weekly Attendance"
          value="165"
          description="+5% vs last week"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Groups"
          value="8"
          description="Small groups and ministries"
          icon={<Church className="h-4 w-4" />}
        />
        <StatsCard
          title="Upcoming Events"
          value="3"
          description="Next 7 days"
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-8">
        <AttendanceChart />
        <IncomeWidget />
      </div>
    </div>
  );
}