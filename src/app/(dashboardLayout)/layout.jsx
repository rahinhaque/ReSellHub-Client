"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/Dashboardsidebar";
import Navbar from "@/components/Navbar";
import { Menu } from "lucide-react";


export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar stays */}
      <Navbar />

      {/* Mobile: sidebar toggle bar */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white sticky top-16 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu size={16} />
          Menu
        </button>
        <p className="text-sm text-gray-400 truncate">Dashboard</p>
      </div>

      {/* Sidebar + content side by side */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop sidebar — always visible on lg+ */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Mobile sidebar — slide-over overlay */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <DashboardSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 text-gray-900 min-w-0">
          {children}
        </main>
      </div>
      {/* ❌ No Footer here */}
    </div>
  );
}
