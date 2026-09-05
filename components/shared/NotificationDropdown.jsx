"use client";

import { useState } from "react";
import { Bell, Loader2, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead } =
    useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-indigo-600 transition shadow-2xs cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 py-4 z-50 animate-fadeIn">
          <div className="px-5 pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-slate-900 tracking-wide">
              Notifications Center
            </h3>
            <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400 font-medium">
                No notifications right now
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && markAsRead(n._id)}
                  className={`p-4 transition hover:bg-slate-50 cursor-pointer flex items-start justify-between gap-3 ${
                    !n.read ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {n.message}
                    </p>
                    {n.targetUrl && (
                      <Link
                        href={n.targetUrl}
                        className="inline-block text-[10px] font-semibold text-indigo-600 hover:underline pt-1"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
