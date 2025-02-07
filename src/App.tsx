import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSessionTimeout } from "@/hooks/use-session-timeout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Members from "@/pages/Members";
import Groups from "@/pages/Groups";
import Events from "@/pages/Events";
import Announcements from "@/pages/Announcements";
import Income from "@/pages/Income";
import Settings from "@/pages/Settings";
import Attendance from "@/pages/Attendance";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AuthenticatedApp() {
  useSessionTimeout();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        {/* Header Section - Fixed at top */}
        <header className="fixed top-0 left-0 right-0 bg-church-600 z-50 h-[120px]">
          <div className="flex items-center justify-center h-full px-4 md:px-6">
            <div className="flex flex-col items-center md:flex-row md:gap-6 max-w-[1600px] w-full">
              <ChurchLogo displayOnly />
              <div className="text-center md:text-left mt-2 md:mt-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white">LIVING FAITH CHURCH</h1>
                <p className="text-lg md:text-xl text-church-100">Chanchaga</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout Container */}
        <div className="flex pt-[120px] min-h-screen">
          {/* Sidebar Navigation - Fixed on left */}
          <aside className="fixed left-0 top-[120px] h-[calc(100vh-120px)] bg-church-600 border-r border-church-700 w-[64px] md:w-[256px] transition-all duration-300 ease-in-out z-40 flex flex-col">
            <nav className="flex-1 overflow-y-auto py-6">
              <AppSidebar />
            </nav>
          </aside>

          {/* Main Content Area - Responsive grid */}
          <main className="flex-1 ml-[64px] md:ml-[256px] p-4 md:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/events" element={<Events />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/income" element={<Income />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/attendance" element={<Attendance />} />
              </Routes>

              <footer className="mt-12 py-4 text-center text-gray-600 border-t border-gray-200">
                2025 © T-TECH GENERAL SERVICES
              </footer>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppContent() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AuthenticatedApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
