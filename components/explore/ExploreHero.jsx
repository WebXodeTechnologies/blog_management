"use client";

import { motion } from "framer-motion";
import { Search, Compass } from "lucide-react";

export default function ExploreHero({ searchQuery, setSearchQuery }) {
  return (
    <div className="text-left max-w-7xl mx-auto mb-10 pb-8 border-b border-slate-200/80 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-sans font-semibold mb-3 shadow-2xs"
          >
            <Compass className="h-3.5 w-3.5 text-blue-600 animate-spin-slow" />
            <span>Texora Community Knowledge Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-slate-950 leading-tight"
          >
            Explore Technical Stories &amp; Aura
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-xl"
          >
            Curated engineering publications, system design architectures, and
            developer stories.
          </motion.p>
        </div>

        {/* Medium-style Quick Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="relative w-full md:w-80 shrink-0"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search publications, topics, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 text-xs sm:text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-all"
          />
        </motion.div>
      </div>
    </div>
  );
}
