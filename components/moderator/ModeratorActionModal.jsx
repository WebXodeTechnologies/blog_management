"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  X,
  Send,
  ShieldCheck,
} from "lucide-react";

export default function ModeratorActionModal({
  article,
  actionType,
  onClose,
  onConfirm,
}) {
  const [selectedReason, setSelectedReason] = useState(
    actionType === "approve"
      ? "Content matches community technical standards"
      : "Spam / Unsolicited Commercial Promotion"
  );
  const [customNote, setCustomNote] = useState("");

  const rejectReasons = [
    "Spam / Unsolicited Commercial Promotion",
    "Copyright Infringement / Duplicate Post",
    "Malicious Code Snippet or Dangerous Script",
    "Misleading Technical Title / Clickbait",
    "Community Conduct & Policy Violation",
    "Other (Specify below)",
  ];

  const approveReasons = [
    "Content matches community technical standards",
    "High quality architectural deep-dive",
    "Verified author & source code references",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason =
      selectedReason === "Other (Specify below)"
        ? customNote || "Custom policy enforcement"
        : selectedReason;
    onConfirm(article.id, actionType, finalReason);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-slate-100 font-sans"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              {actionType === "approve" ? (
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              )}
              <div>
                <h3 className="font-sans font-bold text-lg text-white">
                  {actionType === "approve" ? "Approve & Publish Article" : "Suspend Submission"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Submission ID: <span className="font-mono text-slate-200 font-bold">{article?.id}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Article Info Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <p className="text-xs font-bold text-white line-clamp-1">
              {article?.title}
            </p>
            <p className="text-[11px] text-slate-400">
              Author: <span className="text-slate-200">{article?.author?.name || article?.author}</span> • Tenant: <span className="font-mono text-indigo-400">{article?.tenantId}</span>
            </p>
          </div>

          {/* Reason Selector Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Moderation Audit Reason:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                {(actionType === "approve" ? approveReasons : rejectReasons).map(
                  (reason) => (
                    <label
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition ${
                        selectedReason === reason
                          ? actionType === "approve"
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                            : "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="sr-only"
                      />
                      <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center shrink-0">
                        {selectedReason === reason && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              actionType === "approve" ? "bg-emerald-400" : "bg-indigo-400"
                            }`}
                          />
                        )}
                      </span>
                      <span>{reason}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {selectedReason === "Other (Specify below)" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Specify Custom Enforcement Note:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide specific guidelines feedback..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition shadow-md flex items-center gap-1.5 cursor-pointer ${
                  actionType === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                    : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
                }`}
              >
                <span>Confirm {actionType === "approve" ? "Approval" : "Suspension"}</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
