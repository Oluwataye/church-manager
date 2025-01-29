import { Users, TrendingUp, Church, Calendar } from "lucide-react";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { AttendanceChart } from "@/components/Dashboard/AttendanceChart";
import { IncomeWidget } from "@/components/Dashboard/IncomeWidget";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Overview of your church's key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="w-full">
          <AttendanceChart />
        </div>
        <div className="w-full">
          <IncomeWidget />
        </div>
      </div>
    </div>
  );
}