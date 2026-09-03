"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  X,
  Send,
  ShieldCheck,
  AlertOctagon,
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
    "Excellent technical accuracy & code samples",
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
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-slate-900 font-sans"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {actionType === "approve" ? (
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              ) : (
                <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
                  <AlertOctagon className="h-5 w-5" />
                </div>
              )}
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900">
                  {actionType === "approve"
                    ? "Approve & Publish Article"
                    : "Suspend Submission"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Submission ID:{" "}
                  <span className="font-mono text-indigo-600 font-bold">
                    {article?.id}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Article Info Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <p className="text-xs font-extrabold text-slate-900 line-clamp-1">
              {article?.title}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Author:{" "}
              <strong className="text-slate-800">
                {article?.author?.name || article?.author || "Anonymous"}
              </strong>{" "}
              • Scope:{" "}
              <span className="font-mono text-indigo-600 font-bold">
                {article?.tenantId}
              </span>
            </p>
          </div>

          {/* Reason Selector Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Select Moderation Audit Reason:
              </label>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-none">
                {(actionType === "approve" ? approveReasons : rejectReasons).map(
                  (reason) => {
                    const isSelected = selectedReason === reason;
                    return (
                      <label
                        key={reason}
                        onClick={() => setSelectedReason(reason)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition font-medium ${
                          isSelected
                            ? actionType === "approve"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-2xs"
                              : "bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-2xs"
                            : "bg-slate-50/60 border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          checked={isSelected}
                          onChange={() => setSelectedReason(reason)}
                          className="sr-only"
                        />
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? actionType === "approve"
                                ? "border-emerald-600 bg-emerald-600"
                                : "border-rose-600 bg-rose-600"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span>{reason}</span>
                      </label>
                    );
                  }
                )}
              </div>
            </div>

            {selectedReason === "Other (Specify below)" && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Specify Custom Enforcement Note:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide specific guidelines feedback..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition font-medium"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-md flex items-center gap-1.5 cursor-pointer ${
                  actionType === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                }`}
              >
                <span>
                  Confirm {actionType === "approve" ? "Approval" : "Suspension"}
                </span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
