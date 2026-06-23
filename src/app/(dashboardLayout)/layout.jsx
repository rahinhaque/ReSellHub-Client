// app/dashboard/layout.jsx
// This layout OVERRIDES the root layout for all /dashboard routes.
// It keeps the Navbar but removes the Footer and sets the dark bg.

import DashboardSidebar from "@/components/Dashboardsidebar";
import Navbar from "@/components/Navbar";


export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar stays */}
      <Navbar />

      {/* Sidebar + content side by side */}
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        {/* Main content area — matches the dark sidebar */}
        <main className="flex-1 overflow-y-auto bg-white p-6 text-gray-900">
          {children}
        </main>
      </div>
      {/* ❌ No Footer here */}
    </div>
  );
}
