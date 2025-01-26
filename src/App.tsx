import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<div>Dashboard</div>} />
              <Route path="/members" element={<div>Members</div>} />
              <Route path="/events" element={<div>Events</div>} />
              <Route path="/announcements" element={<div>Announcements</div>} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  </div>
  );
}

export default App;