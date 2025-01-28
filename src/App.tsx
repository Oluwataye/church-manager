import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-church-700">LIVING FAITH CHURCH</h1>
              <p className="text-xl text-church-500 mt-1">Chanchaga</p>
            </div>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/events" element={<Events />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/income" element={<Income />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
            <footer className="mt-auto py-4 text-center text-gray-600">
              2024 © T-TECH GENERAL SERVICES
            </footer>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;