"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronRight } from "lucide-react";

export default function ProfileCompletionModal({ show, user }) {
  if (!show) return null;

  const completedCount = [user?.name, user?.bio, user?.avatar].filter(
    Boolean
  ).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-brand font-black text-lg text-slate-950 tracking-tight">
                Profile Setup Required
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Mandatory author profile verification
              </p>
            </div>
          </div>

          {/* Minimal Readiness Info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Author Profile Readiness</span>
              <span className="text-indigo-600 font-mono font-bold">
                {completedCount} of 3 complete
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed pt-1 font-medium">
              Texora requires all technical authors to have a verified full
              name, bio, and profile photo before writing or publishing stories.
            </p>
          </div>

          {/* Single Full-Width Mandatory CTA Button */}
          <div className="pt-1">
            <Link
              href="/dashboard/profile"
              className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer border border-indigo-500"
            >
              <span>Go to Profile Settings</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
