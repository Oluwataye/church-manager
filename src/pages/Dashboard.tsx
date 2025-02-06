import { Users, TrendingUp, Church, Calendar } from "lucide-react";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { AttendanceChart } from "@/components/Dashboard/AttendanceChart";
import { IncomeWidget } from "@/components/Dashboard/IncomeWidget";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Overview of your church's key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={() => navigate("/members")} className="cursor-pointer">
                <StatsCard
                  title="Total Members"
                  value="150"
                  description={
                    <div className="space-y-1">
                      <p>Men: 60 | Women: 70</p>
                      <p>Children: 20</p>
                    </div>
                  }
                  icon={<Users className="h-4 w-4" />}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view members list</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={() => navigate("/attendance")} className="cursor-pointer">
                <StatsCard
                  title="Weekly Attendance"
                  value="165"
                  description={
                    <div className="space-y-1">
                      <p>Men: 65 | Women: 75</p>
                      <p>Children: 25</p>
                    </div>
                  }
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view attendance records</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={() => navigate("/groups")} className="cursor-pointer">
                <StatsCard
                  title="Active Groups"
                  value="8"
                  description="Small groups and ministries"
                  icon={<Church className="h-4 w-4" />}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to manage church groups</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={() => navigate("/events")} className="cursor-pointer">
                <StatsCard
                  title="Upcoming Events"
                  value="3"
                  description="Next 7 days"
                  icon={<Calendar className="h-4 w-4" />}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view upcoming events</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div 
          className="w-full cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => navigate("/attendance")}
        >
          <AttendanceChart />
        </div>
        <div 
          className="w-full cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => navigate("/income")}
        >
          <IncomeWidget />
        </div>
      </div>
    </div>
  );
}