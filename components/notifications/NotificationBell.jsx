"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch initial notifications
    fetch("/api/v1/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n) => !n.read).length);
        }
      })
      .catch(() => {});

    // Listen via Socket.io for real-time notifications
    const socket = io();
    if (userId) {
      socket.emit("join_user_room", userId);
      socket.on("receive_notification", (notif) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => socket.disconnect();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-indigo-600 hover:border-slate-300 transition shadow-sm"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-4 z-50 space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-xs text-slate-900">Notifications</h3>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              {unreadCount} Unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && markAsRead(n._id)}
                  className={`p-3 rounded-2xl transition cursor-pointer ${
                    n.read ? "bg-white opacity-70" : "bg-indigo-50/40"
                  }`}
                >
                  <p className="text-xs font-bold text-slate-800">{n.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {n.message}
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 block font-mono">
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
