"use client";

import Link from "next/link";
import { UserPlus, ArrowRight } from "lucide-react";

export default function RecentActivityTable({ users = [], loading = false }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            Recent Registered Users
          </h2>
          <p className="text-xs text-slate-500">Latest user signups across the platform</p>
        </div>
        <Link
          href="/admin/users"
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition-colors"
        >
          <span>View Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-200/80">
            <tr>
              <th className="px-4 py-3 rounded-l-xl">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined Date</th>
              <th className="px-4 py-3 rounded-r-xl text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400">
                  Loading recent activity...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400">
                  No users registered yet.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{u.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === "admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : u.role === "moderator"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/admin/users?search=${encodeURIComponent(u.email)}`}
                      className="text-xs text-indigo-600 hover:text-indigo-900 font-semibold"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
