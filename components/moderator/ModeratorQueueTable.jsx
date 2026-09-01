"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Edit,
  ShieldAlert,
} from "lucide-react";

export default function ModeratorQueueTable({
  items,
  onInspect,
  onEdit,
  onApprove,
  onReject,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tenantId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (riskFilter === "high") return item.riskLevel === "high";
    if (riskFilter === "low") return item.riskLevel === "low";
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 font-sans text-slate-900">
      {/* Table Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Pending Moderation Queue
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono text-xs font-bold border border-amber-200">
              {filteredItems.length} awaiting review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review submissions, edit blog content, approve for publication, or reject/suspend guidelines violations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-200/80 w-full sm:w-auto">
            {["all", "high", "low"].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                  riskFilter === r
                    ? "bg-white text-slate-900 shadow-xs font-bold border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r === "all" ? "All Risk" : `${r} Risk`}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
            <input
              type="text"
              placeholder="Filter by title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
          <p className="text-xs text-slate-500 font-semibold">No submissions match the queue filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Submission Details</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Scope</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">AI Risk Score</th>
                <th className="py-3.5 px-4 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                  {/* Article Title & Category */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {item.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px] border border-indigo-100">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                    </div>
                  </td>

                  {/* Author Info */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs overflow-hidden border border-indigo-100">
                        {item.author.avatar ? (
                          <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          item.author.name[0]
                        )}
                      </div>
                      <span className="font-medium text-slate-900">{item.author.name}</span>
                    </div>
                  </td>

                  {/* Tenant ID */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                      {item.tenantId}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{item.submittedAt}</span>
                    </div>
                  </td>

                  {/* Risk Score */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        item.riskLevel === "high"
                          ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {item.riskScore}
                    </span>
                  </td>

                  {/* Action Buttons: Review, Edit, Approve, Suspend */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* 1. Review */}
                      <button
                        onClick={() => onInspect(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                        title="Inspect & Review Submission"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Review</span>
                      </button>

                      {/* 2. Edit */}
                      <button
                        onClick={() => onEdit && onEdit(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition cursor-pointer border border-indigo-200 flex items-center gap-1"
                        title="Edit Submission Details"
                      >
                        <Edit className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Edit</span>
                      </button>

                      {/* 3. Approve */}
                      <button
                        onClick={() => onApprove(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1"
                        title="Approve & Publish"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>

                      {/* 4. Suspend/Reject */}
                      <button
                        onClick={() => onReject(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition cursor-pointer flex items-center gap-1"
                        title="Reject or Suspend Submission"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Suspend</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
