"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateTicketForm({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error("Subject and description are required.");
      return;
    }

    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Opening your ticket...");

    try {
      const res = await fetch("/api/v1/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tenantId: user?.tenantId || user?._id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create ticket");
      }

      toast.success("Ticket created successfully!", { id: toastId });
      router.push(`/dashboard/tickets/${data.ticket._id}`);
      router.refresh();
    } catch (err) {
      console.error("🔥 Submission Error:", err);
      toast.error(err.message || "Failed to submit ticket.", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-5"
    >
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Subject
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          placeholder="Brief summary of your request or dispute"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition capitalize"
          >
            <option value="general">General Support</option>
            <option value="dispute">Dispute</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Priority Level
          </label>
          <select
            name="priority"
            defaultValue="medium"
            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          required
          rows={5}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Provide explicit details to help our support team resolve your issue quickly..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span>Submit Ticket</span>
      </button>
    </form>
  );
}
