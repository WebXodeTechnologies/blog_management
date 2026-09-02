"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";

export default function PublishModal({
  show,
  title,
  subtitle,
  content,
  category,
  readTimeMin,
  wordCount,
  publishing,
  onClose,
  onConfirmPublish,
}) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xl font-sans overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-8 space-y-5 max-h-[90vh] flex flex-col my-auto"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-950">
                  Ready to Publish Your Story?
                </h3>
                <p className="text-xs text-slate-500">
                  Review pre-publish settings before making live.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-950 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Story Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {category}
            </span>
            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
              {title || "Untitled Technical Story"}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              {subtitle || content}
            </p>
            <div className="text-[11px] text-slate-400 font-mono pt-1">
              Estimated read time: {readTimeMin} min • {wordCount} words
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Back to Editing
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onConfirmPublish();
              }}
              disabled={publishing}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer border border-indigo-500 disabled:opacity-50"
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>
                {publishing ? "Publishing..." : "Confirm & Publish Now"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
