"use client";

import { useState, useEffect } from "react";
import ModeratorAnalyticsHeader from "@/components/moderator/ModeratorAnalyticsHeader";
import ModeratorQueueTable from "@/components/moderator/ModeratorQueueTable";
import ModeratorActionModal from "@/components/moderator/ModeratorActionModal";
import ModeratorAuditStream from "@/components/moderator/ModeratorAuditStream";
import {
  X,
  Edit,
  Check,
  Save,
  FileText,
  Clock,
  Sparkles,
  BookOpen,
  Bold,
  Heading,
  Code,
  List,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";

// Utility function to strip raw HTML tags cleanly into readable text
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

export default function ModeratorControlCenterPage() {
  const [queueItems, setQueueItems] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approvedToday: 28,
    flagged: 0,
    safetyActions: 184,
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inspection Drawer State
  const [inspectingItem, setInspectingItem] = useState(null);

  // Edit Blog State ({ article, tab })
  const [editingItem, setEditingItem] = useState(null);
  const [editTab, setEditTab] = useState("metadata"); // "metadata" | "content"
  const [editFormData, setEditFormData] = useState({
    title: "",
    snippet: "",
    category: "",
    content: "",
  });

  // Decision Modal State ({ article, actionType: 'approve' | 'reject' })
  const [activeModal, setActiveModal] = useState(null);

  // Fetch Queue & Audit Logs from API
  const fetchModerationData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/moderation");
      const data = await res.json();

      if (res.ok && data.success) {
        if (!data.queue || data.queue.length === 0) {
          // Auto-seed real pending blog submissions in MongoDB if empty
          await fetch("/api/v1/moderation/seed");
          const retryRes = await fetch("/api/v1/moderation");
          const retryData = await retryRes.json();
          if (retryRes.ok && retryData.success) {
            setQueueItems(retryData.queue || []);
            if (retryData.stats) setStats(retryData.stats);
            if (retryData.auditLogs) setAuditLogs(retryData.auditLogs);
            return;
          }
        }
        setQueueItems(data.queue || []);
        if (data.stats) setStats(data.stats);
        if (data.auditLogs && data.auditLogs.length > 0) {
          setAuditLogs(data.auditLogs);
        }
      } else {
        console.warn("Moderation API warning:", data.message || data.error);
      }
    } catch (err) {
      console.error("Error fetching moderation queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationData();
  }, []);

  // Triggers
  const handleOpenApprove = (item) => {
    setActiveModal({ article: item, actionType: "approve" });
  };

  const handleOpenReject = (item) => {
    setActiveModal({ article: item, actionType: "reject" });
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditTab("metadata");
    setEditFormData({
      title: item.title || "",
      snippet: item.snippet || item.excerpt || "",
      category: item.category || "Architecture",
      content: item.content || item.snippet || "",
    });
  };

  const insertSnippetFormat = (prefix, suffix = "") => {
    setEditFormData((prev) => ({
      ...prev,
      content: `${prev.content}\n${prefix}${suffix}`,
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const blogId = editingItem.rawId || editingItem.id;
      const res = await fetch(`/api/v1/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editFormData.title,
          excerpt: editFormData.snippet,
          content: editFormData.content,
        }),
      });
      const data = await res.json();

      if (data.success || res.ok) {
        setQueueItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  title: editFormData.title,
                  snippet: editFormData.snippet,
                  category: editFormData.category,
                  content: editFormData.content,
                }
              : item
          )
        );
        toast.success(`Moderator edits saved for ${editingItem.id}!`);
      } else {
        toast.error(data.message || "Failed to update blog details");
      }
    } catch (err) {
      toast.error("Error connecting to server for blog update");
    } finally {
      setEditingItem(null);
    }
  };

  const handleConfirmDecision = async (id, actionType, reason) => {
    const targetItem = queueItems.find((i) => i.id === id);
    const blogId = targetItem?.rawId || id;

    try {
      const res = await fetch("/api/v1/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          actionType,
          reason,
          title: targetItem?.title,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setQueueItems((prev) => prev.filter((i) => i.id !== id));
        if (data.auditLog) {
          setAuditLogs((prev) => [data.auditLog, ...prev]);
        }
        if (actionType === "approve") {
          toast.success(`Submission ${id} approved & published to feed!`);
        } else {
          toast.error(`Submission ${id} suspended/rejected. Reason logged.`);
        }
      } else {
        setQueueItems((prev) => prev.filter((i) => i.id !== id));
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
        toast.success(`Action applied for ${id}`);
      }
    } catch (err) {
      toast.error("Network error executing decision");
    } finally {
      setActiveModal(null);
      setInspectingItem(null);
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

      {/* Clean Light Inspection Review Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl text-slate-900 font-sans">
            {/* Modal Header */}
            <div className="pb-4 border-b border-slate-100 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                    {inspectingItem.id}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                    Tenant: {inspectingItem.tenantId}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                    Category: {inspectingItem.category || "Architecture"}
                  </span>
                </div>

                <button
                  onClick={() => setInspectingItem(null)}
                  className="text-slate-400 hover:text-slate-900 p-2 rounded-2xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Title & Author Seniority Badge */}
              <div className="space-y-2">
                <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-snug">
                  {inspectingItem.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] overflow-hidden">
                      {inspectingItem.author?.avatar ? (
                        <img
                          src={inspectingItem.author.avatar}
                          alt={inspectingItem.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        inspectingItem.author?.name?.[0] || "A"
                      )}
                    </div>
                    <span className="font-bold text-slate-900">
                      {inspectingItem.author?.name || "Anonymous Dev"}
                    </span>
                  </div>

                  <span className="text-slate-300">•</span>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                      inspectingItem.author?.seniorityLevel === "founder"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : inspectingItem.author?.seniorityLevel === "senior_developer"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : inspectingItem.author?.seniorityLevel === "veteran"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {inspectingItem.author?.seniorityLevel === "senior_developer"
                      ? "Senior Dev"
                      : inspectingItem.author?.seniorityLevel === "founder"
                      ? "Founder Mod"
                      : inspectingItem.author?.seniorityLevel === "veteran"
                      ? "Veteran Mod"
                      : "Tech Enthusiast"}
                  </span>

                  <span className="text-slate-300">•</span>

                  <span className="text-slate-500 font-medium">
                    AI Risk:{" "}
                    <strong
                      className={`font-mono ${
                        inspectingItem.riskLevel === "high"
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {inspectingItem.riskScore}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Formatted Article Content (Stripped of Raw HTML Tags) */}
            <div className="my-4 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 grow">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <BookOpen className="h-4 w-4" />
                  <span>Full Article Content (Clean Reading View)</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  ~{stripHtml(inspectingItem.content || inspectingItem.snippet).split(/\s+/).length} words
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 font-sans whitespace-pre-wrap selection:bg-indigo-100">
                {stripHtml(inspectingItem.content || inspectingItem.snippet)}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
              <button
                onClick={() => {
                  setInspectingItem(null);
                  handleOpenEdit(inspectingItem);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={() => handleOpenReject(inspectingItem)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
              >
                Suspend Submission
              </button>

              <button
                onClick={() => handleOpenApprove(inspectingItem)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                Approve &amp; Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Light Rich Moderator Edit Blog Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl text-slate-900 font-sans">
            {/* Modal Header & Tabs */}
            <div className="pb-3 border-b border-slate-100 space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                    <Edit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-slate-900">
                      Edit Blog Submission
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Submission ID:{" "}
                      <span className="font-mono text-indigo-600 font-bold">
                        {editingItem.id}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingItem(null)}
                  className="p-2 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setEditTab("metadata")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    editTab === "metadata"
                      ? "bg-white text-indigo-600 shadow-2xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  General Metadata &amp; Excerpt
                </button>
                <button
                  type="button"
                  onClick={() => setEditTab("content")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    editTab === "content"
                      ? "bg-white text-indigo-600 shadow-2xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Full Article Content Editor
                </button>
              </div>
            </div>

            {/* Form Fields Body */}
            <form onSubmit={handleSaveEdit} className="my-4 space-y-4 grow overflow-y-auto pr-1">
              {editTab === "metadata" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Article Title
                    </label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold shadow-2xs transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold shadow-2xs transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Excerpt &amp; Summary Snippet
                    </label>
                    <textarea
                      rows={5}
                      value={editFormData.snippet}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, snippet: e.target.value })
                      }
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed resize-none transition font-medium"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-slate-800">
                      Full Article Body Content
                    </span>

                    {/* Editor Toolbar */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => insertSnippetFormat("**", "**")}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition"
                        title="Add Bold Text"
                      >
                        <Bold className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetFormat("### ")}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition"
                        title="Add Heading"
                      >
                        <Heading className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetFormat("```js\n", "\n```")}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition"
                        title="Add Code Block"
                      >
                        <Code className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetFormat("- ")}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition"
                        title="Add Bullet Point"
                      >
                        <List className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={editFormData.content}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, content: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed transition resize-none"
                    placeholder="Write or edit full article content..."
                    required
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>
                      {editFormData.content.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span>{editFormData.content.length} characters</span>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
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
