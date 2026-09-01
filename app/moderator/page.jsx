"use client";

import { useState } from "react";
import ModeratorAnalyticsHeader from "@/components/moderator/ModeratorAnalyticsHeader";
import ModeratorQueueTable from "@/components/moderator/ModeratorQueueTable";
import ModeratorActionModal from "@/components/moderator/ModeratorActionModal";
import ModeratorAuditStream from "@/components/moderator/ModeratorAuditStream";
import { X, Edit, Check, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function ModeratorControlCenterPage() {
  // Sample moderation queue data
  const [queueItems, setQueueItems] = useState([
    {
      id: "SUB-9021",
      title: "Building Distributed Event Loops in Rust & Node.js",
      category: "Architecture",
      tenantId: "tech-pulse",
      author: { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
      submittedAt: "12 mins ago",
      riskScore: "Low (4%)",
      riskLevel: "low",
      snippet: "An architectural deep-dive into thread pools, lock-free queues, and asynchronous event loops for high-throughput microservices...",
    },
    {
      id: "SUB-9020",
      title: "Automated Crypto Airdrop Bot & Flash Loan Script",
      category: "Web3 / Finance",
      tenantId: "crypto-vault",
      author: { name: "Anonymous Dev", avatar: "" },
      submittedAt: "45 mins ago",
      riskScore: "High (86%)",
      riskLevel: "high",
      snippet: "Learn how to trigger automated arbitrage transactions using flash loan smart contracts across decentralized exchanges...",
    },
    {
      id: "SUB-9019",
      title: "Zero-Trust Security Patterns in Enterprise Next.js App Router",
      category: "Security",
      tenantId: "next-gen",
      author: { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" },
      submittedAt: "2 hours ago",
      riskScore: "Low (2%)",
      riskLevel: "low",
      snippet: "Enforcing strict authorization policies, RBAC middleware, and CSP headers in modern multi-tenant App Router setups...",
    },
  ]);

  // Inspection Drawer State
  const [inspectingItem, setInspectingItem] = useState(null);

  // Edit Blog State ({ article })
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", snippet: "", category: "" });

  // Decision Modal State ({ article, actionType: 'approve' | 'reject' })
  const [activeModal, setActiveModal] = useState(null);

  // Real-time Audit Stream State
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "LOG-8812",
      moderator: "Safety System Bot",
      action: "AUTO_FLAGGED",
      target: "SUB-9020 Automated Crypto Airdrop Bot",
      reason: "High risk keyword pattern detected (86%)",
      timestamp: "5 mins ago",
      type: "warning",
    },
    {
      id: "LOG-8811",
      moderator: "Lead Moderator",
      action: "APPROVED_POST",
      target: "SUB-9018 Microservices Architecture Benchmarks",
      reason: "Verified code snippets & author reputation",
      timestamp: "28 mins ago",
      type: "success",
    },
  ]);

  // Triggers
  const handleOpenApprove = (item) => {
    setActiveModal({ article: item, actionType: "approve" });
  };

  const handleOpenReject = (item) => {
    setActiveModal({ article: item, actionType: "reject" });
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      snippet: item.snippet,
      category: item.category,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: editFormData.title,
              snippet: editFormData.snippet,
              category: editFormData.category,
            }
          : item
      )
    );

    toast.success(`Moderator edits saved for ${editingItem.id}!`);
    setEditingItem(null);
  };

  const handleConfirmDecision = (id, actionType, reason) => {
    const targetItem = queueItems.find((i) => i.id === id);
    setQueueItems((prev) => prev.filter((i) => i.id !== id));
    setActiveModal(null);
    setInspectingItem(null);

    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      moderator: "Platform Moderator",
      action: actionType === "approve" ? "APPROVED_POST" : "SUSPENDED_POST",
      target: `${id} ${targetItem?.title || ""}`,
      reason: reason,
      timestamp: "Just now",
      type: actionType === "approve" ? "success" : "danger",
    };

    setAuditLogs((prev) => [newLog, ...prev]);

    if (actionType === "approve") {
      toast.success(`Submission ${id} approved & published to feed!`);
    } else {
      toast.error(`Submission ${id} suspended/rejected. Reason logged.`);
    }
  };

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16">
      {/* Moderation Analytics Header */}
      <ModeratorAnalyticsHeader
        stats={{
          pending: queueItems.length,
          approvedToday: 28,
          flagged: queueItems.filter((i) => i.riskLevel === "high").length,
          safetyActions: 184,
        }}
      />

      {/* Interactive Queue Data Table with Review, Edit, Approve, Suspend Controls */}
      <ModeratorQueueTable
        items={queueItems}
        onInspect={(item) => setInspectingItem(item)}
        onEdit={handleOpenEdit}
        onApprove={handleOpenApprove}
        onReject={handleOpenReject}
      />

      {/* Real-time Safety Audit Log Stream */}
      <ModeratorAuditStream logs={auditLogs} />

      {/* Inspect Submission Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-2xl text-slate-900 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  {inspectingItem.id}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                  Tenant Scope: {inspectingItem.tenantId}
                </span>
              </div>

              <button
                onClick={() => setInspectingItem(null)}
                className="text-slate-400 hover:text-slate-900 font-bold text-sm cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="font-heading font-bold text-xl text-slate-900">
              {inspectingItem.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Author: <strong className="text-slate-900">{inspectingItem.author.name}</strong></span>
              <span>•</span>
              <span>Risk Assessment: <strong className="text-slate-900 font-mono font-bold">{inspectingItem.riskScore}</strong></span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900 mb-1">Blog Excerpt Preview:</p>
              <p>{inspectingItem.snippet}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setInspectingItem(null);
                  handleOpenEdit(inspectingItem);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 cursor-pointer flex items-center gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={() => handleOpenReject(inspectingItem)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                Suspend Submission
              </button>

              <button
                onClick={() => handleOpenApprove(inspectingItem)}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs cursor-pointer"
              >
                Approve &amp; Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moderator Edit Blog Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                <Edit className="h-4 w-4 text-indigo-600" />
                <span>Edit Blog Details (Moderator)</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, category: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Excerpt &amp; Summary Snippet
                </label>
                <textarea
                  rows={4}
                  value={editFormData.snippet}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, snippet: e.target.value })
                  }
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Edits</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decision Workflow Action Modal */}
      {activeModal && (
        <ModeratorActionModal
          article={activeModal.article}
          actionType={activeModal.actionType}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirmDecision}
        />
      )}
    </div>
  );
}
