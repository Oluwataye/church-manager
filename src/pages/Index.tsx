import { Card } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-church-600">Welcome to Church Manager</h1>
              <p className="text-gray-600 mt-2">Manage your church efficiently and effectively</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Total Members</h3>
                <p className="text-3xl font-bold text-church-500">150</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Upcoming Events</h3>
                <p className="text-3xl font-bold text-church-500">3</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">New Members</h3>
                <p className="text-3xl font-bold text-church-500">12</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Announcements</h3>
                <p className="text-3xl font-bold text-church-500">5</p>
              </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-xl mb-4">Recent Members</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-church-100 rounded-full flex items-center justify-center">
                        <span className="text-church-600 font-semibold">JD</span>
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-500">Joined 2 days ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-xl mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-church-100 rounded-full flex items-center justify-center">
                        <span className="text-church-600 font-semibold">{i}</span>
                      </div>
                      <div>
                        <p className="font-medium">Sunday Service</p>
                        <p className="text-sm text-gray-500">Sunday, 9:00 AM</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;