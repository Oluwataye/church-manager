import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Members from "@/pages/Members";
import Events from "@/pages/Events";
import Announcements from "@/pages/Announcements";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<div>Dashboard</div>} />
              <Route path="/members" element={<Members />} />
              <Route path="/events" element={<Events />} />
              <Route path="/announcements" element={<Announcements />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;