"use client";

import Link from "next/link";
import Image from "next/image";
import { Layers, ArrowRight } from "lucide-react";
import { UNSPLASH_IMAGES } from "@/constants/categories";

const TOPIC_DETAILS = [
  {
    name: "System Architecture",
    tagline:
      "Micro-frontends, event-driven systems, caching & distributed infrastructure.",
    audience: "For Engineers & Architects",
    image: UNSPLASH_IMAGES.systemArchitecture,
    storiesCount: 142,
  },
  {
    name: "AI & Data Pipelines",
    tagline:
      "LLM inference optimization, worker queues, and real-time streaming.",
    audience: "For AI Engineers & Researchers",
    image: UNSPLASH_IMAGES.aiData,
    storiesCount: 98,
  },
  {
    name: "Web Development",
    tagline:
      "Next.js 16, React 19, Tailwind CSS v4, and modern UI engineering.",
    audience: "For Frontend & Fullstack Developers",
    image: UNSPLASH_IMAGES.webDev,
    storiesCount: 215,
  },
  {
    name: "Startups & Scaling",
    tagline:
      "Multi-tenant SaaS, pricing strategy, customer acquisition & scale.",
    audience: "For Founders & Product Leads",
    image: UNSPLASH_IMAGES.startupsScaling,
    storiesCount: 84,
  },
  {
    name: "Founder's Notes",
    tagline:
      "Unfiltered lessons, architectural decisions, and startup reflections.",
    audience: "For Founders & Executive Leadership",
    image: UNSPLASH_IMAGES.foundersNotes,
    storiesCount: 65,
  },
  {
    name: "Career & Learning",
    tagline:
      "System design roadmaps, CS fundamentals, and career growth guides.",
    audience: "For Students & Emerging Developers",
    image: UNSPLASH_IMAGES.careerLearning,
    storiesCount: 178,
  },
];

export default function TopicsPage() {
  return (
    <div className="relative min-h-screen pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 backdrop-blur-md text-blue-700 text-xs font-sans font-semibold mb-4 shadow-2xs">
          <Layers className="h-3.5 w-3.5 text-blue-600" />
          <span>Topic Directory</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-slate-950 mb-4">
          Explore Technical Topics
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Categorized knowledge tailored for students, software engineers, tech
          leads, and SaaS founders.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TOPIC_DETAILS.map((topic, idx) => (
          <Link
            key={idx}
            href={`/explore?category=${encodeURIComponent(topic.name)}`}
            className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] hover:border-blue-500/40 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              {/* Unsplash Cover Header */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 border border-slate-100">
                <Image
                  src={topic.image}
                  alt={topic.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-sans font-medium border border-white/20">
                  {topic.audience}
                </span>
              </div>

              <h2 className="font-heading font-bold text-xl text-slate-950 group-hover:text-blue-600 transition-colors mb-2">
                {topic.name}
              </h2>

              <p className="text-xs font-sans text-slate-600 leading-relaxed mb-6">
                {topic.tagline}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-sans font-semibold text-slate-900">
              <span className="text-slate-500 font-normal">
                {topic.storiesCount} Publications
              </span>
              <span className="inline-flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Browse Topic</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
