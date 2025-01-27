import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChurchLogo } from "@/components/Layout/ChurchLogo";
import Members from "@/pages/Members";
import Events from "@/pages/Events";
import Announcements from "@/pages/Announcements";
import Income from "@/pages/Income";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="mb-8">
              <ChurchLogo />
            </div>
            <Routes>
              <Route path="/" element={<div>Dashboard</div>} />
              <Route path="/members" element={<Members />} />
              <Route path="/events" element={<Events />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/income" element={<Income />} />
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