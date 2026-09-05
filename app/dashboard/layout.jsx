"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { SocketProvider } from "@/components/providers/SocketProvider";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          window.location.href = `/login?callbackUrl=${encodeURIComponent(
            window.location.pathname
          )}`;
        }
      })
      .catch(() => {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(
          window.location.pathname
        )}`;
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-slate-50 text-slate-950 flex font-sans selection:bg-blue-600 selection:text-white">
        {/* SaaS Sidebar Navigation Shell (Fixed on left) */}
        <DashboardSidebar
          user={user}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Admin Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* SaaS Top Header Navbar */}
          <DashboardHeader
            user={user}
            onMobileToggle={() => setMobileOpen(true)}
          />

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}
