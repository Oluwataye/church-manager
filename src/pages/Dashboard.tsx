import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, Bell, TrendingUp } from "lucide-react";
import { AttendanceWidget } from "@/components/Dashboard/AttendanceWidget";
import { IncomeWidget } from "@/components/Dashboard/IncomeWidget";

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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-church-600 to-church-700 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Church Manager</h1>
        <p className="text-church-100">Manage your church efficiently and effectively</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-church-50 rounded-lg">
              <Users className="h-6 w-6 text-church-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <h3 className="text-2xl font-bold text-church-600">{membersCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
              <h3 className="text-2xl font-bold text-orange-600">{upcomingEvents.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Announcements</p>
              <h3 className="text-2xl font-bold text-purple-600">{announcements.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Income</p>
              <h3 className="text-2xl font-bold text-green-600">₦45,000</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceWidget />
        <IncomeWidget />
      </div>

      {/* Recent Events and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="min-w-[48px] h-12 bg-church-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-church-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(event.start_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(announcement.publish_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-2">{announcement.content}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
