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
          {/* Header Section - Fixed at top with proper spacing */}
          <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 h-[120px]">
            <div className="flex items-center justify-center h-full px-4 md:px-6">
              <div className="flex flex-col items-center md:flex-row md:gap-6 max-w-[1600px] w-full">
                <ChurchLogo displayOnly />
                <div className="text-center md:text-left mt-2 md:mt-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-church-700">LIVING FAITH CHURCH</h1>
                  <p className="text-lg md:text-xl text-church-500">Chanchaga</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Layout Container */}
          <div className="flex min-h-[calc(100vh-120px)]">
            {/* Sidebar Navigation - Fixed position with proper spacing */}
            <aside className="fixed left-0 top-[120px] h-[calc(100vh-120px)] z-40 bg-white border-r border-gray-200">
              <AppSidebar />
            </aside>

            {/* Main Content Area - Responsive padding and margin */}
            <main className="flex-1 ml-[64px] md:ml-[256px] p-4 md:p-6 lg:p-8 mt-[120px]">
              <div className="max-w-[1400px] mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/income" element={<Income />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>

                <footer className="mt-12 py-4 text-center text-gray-600 border-t border-gray-200">
                  2024 © T-TECH GENERAL SERVICES
                </footer>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;