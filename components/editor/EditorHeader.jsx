"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Save,
  Send,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function EditorHeader({
  title,
  userRole,
  lastSavedTime,
  readTimeMin,
  wordCount,
  savingDraft,
  onSaveDraft,
  onOpenPublish,
}) {
  const isModerator = userRole === "moderator";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-2xs font-sans transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Back Navigation & Story Title Info */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-hidden">
          <Link
            href="/dashboard/articles"
            className="p-2 sm:p-2.5 rounded-2xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/80 transition cursor-pointer shrink-0 border border-slate-200/80 bg-white/60 shadow-2xs group"
            title="Back to Articles Manager"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>

          <div className="overflow-hidden space-y-0.5">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <h2 className="text-xs sm:text-sm font-bold text-slate-950 truncate max-w-27.5 xs:max-w-[160px] sm:max-w-xs md:max-w-sm lg:max-w-md">
                {title || "Write your thoughts"}
              </h2>

              {isModerator ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1 shrink-0 shadow-2xs">
                  <ShieldCheck className="h-3 w-3 text-indigo-600" />
                  <span className="hidden sm:inline">Moderator Access</span>
                  <span className="sm:hidden">Mod</span>
                </span>
              ) : (
                <span className="hidden md:inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 items-center gap-1 shrink-0">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  <span>Author Mode</span>
                </span>
              )}
            </div>

            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold shrink-0">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden xs:inline">Auto-saved</span>
              </span>
              <span className="truncate hidden xs:inline">{lastSavedTime}</span>

              <span className="flex items-center gap-1 text-slate-500 shrink-0">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>
                  {readTimeMin} min read
                  <span className="hidden sm:inline"> ({wordCount} words)</span>
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: Action Control Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={savingDraft}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs hover:border-slate-300"
          >
            {savingDraft ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
            ) : (
              <Save className="h-3.5 w-3.5 text-indigo-600" />
            )}
            <span className="hidden sm:inline">
              {savingDraft ? "Saving..." : "Save Draft"}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenPublish}
            className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl bg-linear-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25 border border-indigo-500/80 cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isModerator ? "Publish Story" : "Publish"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
