"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-800/80 text-white p-8 sm:p-16 overflow-hidden shadow-2xl text-center"
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-72 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-72 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-blue-400 text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Join the Developer Revolution</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight mb-6 leading-tight">
            Ready to Build and Publish Your Next Big Idea?
          </h2>

          <p className="text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">
            Start writing, sharing architecture insights, and publishing
            engineering brilliance with TEXORA today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-[0_10px_25px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] transition-all group"
            >
              <span>Start Xplore</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/write"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              <Terminal className="h-4 w-4 text-blue-400" />
              <span>Create Post</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
