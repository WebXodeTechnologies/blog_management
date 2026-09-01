"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Archive,
  Eye,
} from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        page: page.toString(),
        limit: "10",
      });
      const res = await fetch(`/api/v1/admin/blogs?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setBlogs(data.blogs || []);
        setPagination(data.pagination || { totalPages: 1 });
      } else {
        setError(data.error || "Failed to fetch platform blogs");
      }
    } catch (err) {
      setError("Network error fetching blogs");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleUpdateStatus = async (blogId, status) => {
    try {
      const res = await fetch("/api/v1/admin/blogs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, status }),
      });
      if (res.ok) {
        fetchBlogs();
      } else {
        alert("Failed to update article status");
      }
    } catch (err) {
      alert("Error updating article status");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-600" />
            Content & Articles Control
          </h1>
          <p className="text-xs text-slate-500">
            Monitor, moderate, and manage platform-wide blog publications across all tenant organizations.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
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
            placeholder="Search articles by title or slug..."
            className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:border-amber-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-amber-600 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200/80">
              <tr>
                <th className="px-4 py-3.5">Article Title</th>
                <th className="px-4 py-3.5">Author</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-600 mb-2" />
                    Loading platform articles...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    No articles found.
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-900 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 line-clamp-1">{b.title}</span>
                        <span className="text-[11px] text-slate-400 font-mono">/{b.slug}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {b.authorId ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{b.authorId.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{b.authorId.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">Anonymous</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {b.categoryId ? (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: b.categoryId.color || "#3B82F6" }}
                        >
                          {b.categoryId.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : b.status === "rejected"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : b.status === "archived"
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5">
                      {b.status !== "published" && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, "published")}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold"
                          title="Approve & Publish"
                        >
                          Publish
                        </button>
                      )}
                      {b.status !== "rejected" && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, "rejected")}
                          className="px-2.5 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-[11px] font-bold"
                          title="Reject Article"
                        >
                          Reject
                        </button>
                      )}
                      {b.status !== "archived" && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, "archived")}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-[11px] font-bold"
                          title="Archive Article"
                        >
                          Archive
                        </button>
                      )}
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
    </div>
  );
}
