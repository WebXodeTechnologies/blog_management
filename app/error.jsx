"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, Sparkles } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("🔥 App Runtime Exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-xl space-y-6">
        {/* Animated Error Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <AlertOctagon className="h-8 w-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-rose-600" />
            <span>500 • Runtime Exception</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-950 tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while executing this request. Our engineering team has been notified.
          </p>
        </div>

        {error?.message && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left font-mono text-[11px] text-slate-600 overflow-x-auto max-h-28">
            <span className="font-bold text-rose-600">Error:</span> {error.message}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
          >
            <Home className="h-4 w-4 text-slate-500" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
