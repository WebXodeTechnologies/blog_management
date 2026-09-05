"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { SocketProvider } from "@/components/providers/SocketProvider";

export default function PlatformAdminLayout({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    fetch("/api/v1/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role === "admin") {
          setUser(data.user);
        } else {
          window.location.href = `/admin/login?callbackUrl=${encodeURIComponent(pathname)}`;
        }
      })
      .catch(() => {
        window.location.href = `/admin/login?callbackUrl=${encodeURIComponent(pathname)}`;
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  // Don't wrap login page with admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
          <p className="text-xs text-slate-600 font-medium tracking-wide">
            Verifying Root Administrator Privileges...
          </p>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-slate-950">
              Access Restricted
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              You do not have administrator permissions to view the Platform
              Control Center.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-slate-950/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Sign in as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-slate-50 text-slate-950 flex font-sans selection:bg-slate-900 selection:text-white">
        {/* Admin Sidebar Navigation */}
        <AdminSidebar
          user={user}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Admin Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader user={user} onMobileToggle={() => setMobileOpen(true)} />

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}
