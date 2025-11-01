import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, Bell, TrendingUp } from "lucide-react";
import { AttendanceWidget } from "@/components/Dashboard/AttendanceWidget";
import { IncomeWidget } from "@/components/Dashboard/IncomeWidget";
import { Link } from "react-router-dom";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { format } from "date-fns";

const Dashboard = () => {
  // Fetch members count
  const { data: membersCount = 0 } = useQuery({
    queryKey: ["membersCount"],
    queryFn: async () => {
      const { count } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  // Fetch monthly income
  const { data: monthlyIncome = 0 } = useQuery({
    queryKey: ["monthlyIncome"],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data } = await supabase
        .from("incomes")
        .select("amount")
        .gte("date", startOfMonth.toISOString());
      
      return data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    },
  });

  // Fetch upcoming events
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(3);
      return data || [];
    },
  });

  // Fetch recent announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ["recentAnnouncements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">{getGreeting()}!</h1>
        <p className="text-primary-foreground/90 text-lg">
          Welcome to your Church Management Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/members">
          <StatsCard
            title="Total Members"
            value={membersCount}
            icon={<Users className="h-5 w-5" />}
            colorScheme="primary"
            description="Registered members"
            trend={membersCount > 0 ? { value: 12, isPositive: true } : undefined}
          />
        </Link>

        <Link to="/events">
          <StatsCard
            title="Upcoming Events"
            value={upcomingEvents.length}
            icon={<Calendar className="h-5 w-5" />}
            colorScheme="warning"
            description="Events scheduled"
          />
        </Link>

        <Link to="/announcements">
          <StatsCard
            title="Active Announcements"
            value={announcements.length}
            icon={<Bell className="h-5 w-5" />}
            colorScheme="info"
            description="Recent announcements"
          />
        </Link>

        <Link to="/income">
          <StatsCard
            title="Monthly Income"
            value={`₦${monthlyIncome.toLocaleString()}`}
            icon={<TrendingUp className="h-5 w-5" />}
            colorScheme="success"
            description="This month's total"
            trend={monthlyIncome > 0 ? { value: 8, isPositive: true } : undefined}
          />
        </Link>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceWidget />
        <IncomeWidget />
      </div>

      {/* Recent Events and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            <Link 
              to="/events" 
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to="/events"
                  className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="min-w-[56px] h-14 bg-primary/10 rounded-lg flex flex-col items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(event.start_date), "PPP")}
                    </p>
                    {event.location && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium mb-2">No upcoming events</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Start planning your church events
                </p>
                <Link 
                  to="/events" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Create Event
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Announcements</h3>
            <Link 
              to="/announcements" 
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Link
                  key={announcement.id}
                  to="/announcements"
                  className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {announcement.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(announcement.created_at), "MMM d")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium mb-2">No announcements yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep your congregation informed
                </p>
                <Link 
                  to="/announcements" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Create Announcement
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
