"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Shield,
  ChevronLeft,
  ChevronRight,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialSearch);
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  // Role Edit Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("user");
  const [updating, setUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        role: roleFilter,
        page: page.toString(),
        limit: "10",
      });
      const res = await fetch(`/api/v1/admin/users?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        setPagination(data.pagination || { totalPages: 1 });
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Network error fetching users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser._id, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedUser(null);
        fetchUsers();
      } else {
        alert(data.error || "Failed to update role");
      }
    } catch (err) {
      alert("Error updating role");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            User & Access Management
          </h1>
          <p className="text-xs text-slate-500">
            Inspect all registered users, manage platform privileges, and elevate admin/moderator roles.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email address..."
            className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
          >
            <option value="">All Roles</option>
            <option value="user">Standard User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Platform Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200/80">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Joined Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400">
                    No users matching search criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-900">{u.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                        </div>
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
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewRole(u.role);
                        }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 rounded-xl transition-colors"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Page {page} of {pagination.totalPages || 1}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Edit Role for {selectedUser.name}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="space-y-4 text-xs">
              <p className="text-slate-600">
                Updating permissions for <strong className="text-slate-950 font-mono">{selectedUser.email}</strong>.
              </p>

              <div className="space-y-2">
                <label className="text-slate-700 font-semibold">Select Role</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={newRole === "user"}
                      onChange={(e) => setNewRole(e.target.value)}
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Standard User</span>
                      <span className="text-[11px] text-slate-500">Can view & post blogs on assigned tenant</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300">
                    <input
                      type="radio"
                      name="role"
                      value="moderator"
                      checked={newRole === "moderator"}
                      onChange={(e) => setNewRole(e.target.value)}
                    />
                    <div>
                      <span className="font-bold text-amber-700 block">Moderator</span>
                      <span className="text-[11px] text-slate-500">Can access moderation queue & reported content</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={newRole === "admin"}
                      onChange={(e) => setNewRole(e.target.value)}
                    />
                    <div>
                      <span className="font-bold text-purple-700 block">Platform Admin</span>
                      <span className="text-[11px] text-slate-500">Full administrative control over tenants, users, and global settings</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold shadow-md shadow-slate-950/10"
                >
                  {updating ? "Saving..." : "Update Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
