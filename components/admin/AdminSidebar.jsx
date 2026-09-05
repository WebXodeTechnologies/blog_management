"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  Tags,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  X,
  ChevronRight,
  CreditCard,
  FileText,
  ShieldCheck,
  LifeBuoy,
} from "lucide-react";
import texoraLogo from "@/public/logos/logo2.png";

export default function AdminSidebar({ user, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/admin/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/admin/login";
  };

  const navItems = [
    {
      label: "Platform Overview",
      href: "/admin",
      exact: true,
      icon: LayoutDashboard,
    },
    {
      label: "Revenue & Billing",
      href: "/admin/payments",
      icon: CreditCard,
      badge: "SaaS",
    },
    {
      label: "Tenant Control",
      href: "/admin/tenants",
      icon: Building2,
    },
    {
      label: "Support Tickets",
      href: "/admin/tickets",
      icon: LifeBuoy,
      badge: "Live",
    },
    {
      label: "Content & Articles",
      href: "/admin/blogs",
      icon: FileText,
    },
    {
      label: "User Directory",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Moderator Queue",
      href: "/admin/moderators",
      icon: ShieldCheck,
    },
    {
      label: "Categories & Tags",
      href: "/admin/categories",
      icon: Tags,
    },
    {
      label: "Security Audit Logs",
      href: "/admin/audit-logs",
      icon: ShieldAlert,
    },
  ];

  const checkActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200/80 p-4 font-sans select-none shadow-xs">
      {/* Top Header & Brand */}
      <div className="space-y-5">
        {/* Brand Bar with logo2 */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 bg-slate-950">
              <Image
                src={texoraLogo}
                alt="Texora Logo"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-md tracking-normal font-brand text-slate-950 flex items-center gap-1.5">
                Texora Master
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Control Center
              </span>
            </div>
          </Link>

          {/* Mobile Close */}
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Return to Home Link */}
        <div className="px-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100/70 hover:bg-slate-100 hover:text-slate-950 rounded-xl border border-slate-200/80 transition-all duration-200 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-slate-500" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1 pt-1 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = checkActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                  active
                    ? "bg-slate-950 text-white font-semibold shadow-md shadow-slate-950/10"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-900"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  active && <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom User Card with Texora Logo Avatar */}
      <div className="pt-3 border-t border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-xs ring-2 ring-slate-100 shrink-0 bg-slate-950 flex items-center justify-center">
              <Image
                src={texoraLogo}
                alt={user?.name || "Texoradmin Avatar"}
                width={42}
                height={42}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-slate-900 truncate">
                {user?.name || "Texoradmin"}
              </span>
              <span className="text-[11px] text-slate-900 truncate font-mono">
                {user?.email || "admin@texora.com"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
