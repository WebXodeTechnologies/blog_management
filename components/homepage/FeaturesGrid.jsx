"use client";

import { motion } from "framer-motion";
import { PenTool, Sparkles, Globe, Rocket, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: <PenTool className="h-5 w-5 text-blue-600" />,
    badge: "MDX & Code Editor",
    title: "Rich Technical Writing Studio",
    description:
      "Distraction-free Markdown editor built with instant syntax highlighting, LaTeX math formatting, and auto-generated tables of contents.",
    colSpan: "col-span-1 md:col-span-2",
    accent: "from-blue-500/10 via-indigo-500/5 to-transparent",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-purple-600" />,
    badge: "Community Growth",
    title: "Karma & Developer Upvotes",
    description:
      "Build reader trust, earn technical karma badges, and rank on global developer trending feeds.",
    colSpan: "col-span-1",
    accent: "from-purple-500/10 via-pink-500/5 to-transparent",
  },
  {
    icon: <Globe className="h-5 w-5 text-emerald-600" />,
    badge: "Custom Branding",
    title: "Multi-Tenant Custom Domains",
    description:
      "Host your engineering blog on your own custom domain with automated SSL certificate provisioning.",
    colSpan: "col-span-1",
    accent: "from-emerald-500/10 via-teal-500/5 to-transparent",
  },
  {
    icon: <Rocket className="h-5 w-5 text-amber-600" />,
    badge: "Performance & SEO",
    title: "Lightning SSR & OpenGraph Cards",
    description:
      "Sub-100ms response times powered by Next.js Server Components, Redis caching, and dynamic social preview images.",
    colSpan: "col-span-1 md:col-span-2",
    accent: "from-amber-500/10 via-orange-500/5 to-transparent",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans">
      {/* Short & Catchy Section Header Aligned to Blog Creation */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 backdrop-blur-md text-blue-700 text-xs font-sans font-semibold mb-4 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
          <span>Publishing Ecosystem</span>
        </div>

        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 mb-4 tracking-tight leading-tight">
          Write. Publish. Amplify.
        </h2>

        <p className="text-slate-600 text-base sm:text-lg font-sans font-normal leading-relaxed">
          Everything technical creators need to turn deep engineering knowledge into impactful, high-traffic publications.
        </p>
      </div>

      {/* Bento Grid Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className={`${feature.colSpan} relative rounded-3xl p-7 sm:p-8 bg-white/75 backdrop-blur-xl border border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)] hover:border-blue-500/40 transition-all group overflow-hidden flex flex-col justify-between`}
          >
            {/* Subtle Gradient Glow on Hover */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
            />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-xs border border-slate-100/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  {feature.badge}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-950 mb-2.5 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-sm font-sans text-slate-600 leading-relaxed mb-4">
                {feature.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-sans font-semibold text-slate-900 mt-2">
              <span className="group-hover:translate-x-1 transition-transform text-slate-700 group-hover:text-blue-600">
                Explore feature
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
