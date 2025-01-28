import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import Dashboard from "@/pages/Dashboard";
import Members from "@/pages/Members";
import Events from "@/pages/Events";
import Announcements from "@/pages/Announcements";
import Income from "@/pages/Income";
import Settings from "@/pages/Settings";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          {/* Header Section */}
          <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
            <div className="flex items-center justify-center p-4 md:p-6">
              <div className="flex flex-col items-center md:flex-row md:gap-6">
                <ChurchLogo />
                <div className="text-center md:text-left mt-4 md:mt-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-church-700">LIVING FAITH CHURCH</h1>
                  <p className="text-lg md:text-xl text-church-500">Chanchaga</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Grid Layout */}
          <div className="flex pt-[180px] md:pt-[120px]">
            {/* Sidebar Navigation */}
            <aside className="fixed left-0 h-[calc(100vh-120px)] z-40">
              <AppSidebar />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-[64px] md:ml-[256px] p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/events" element={<Events />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/income" element={<Income />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>

              <footer className="mt-8 py-4 text-center text-gray-600">
                2024 © T-TECH GENERAL SERVICES
              </footer>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;