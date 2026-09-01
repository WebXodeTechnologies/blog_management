"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  PenTool,
  Bookmark,
  FileText,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function UserQuickActions() {
  const actions = [
    {
      id: "write",
      title: "Write New Story",
      description: "Create and publish deep technical guides with TipTap editor.",
      icon: <PenTool className="h-5 w-5 text-white" />,
      href: "/dashboard/write",
      cta: "Open Editor",
      highlight: true,
    },
    {
      id: "articles",
      title: "My Articles",
      description: "Manage drafts, published posts, and track reader engagement.",
      icon: <FileText className="h-5 w-5 text-indigo-600" />,
      href: "/dashboard/articles",
      cta: "View Articles",
      highlight: false,
    },
    {
      id: "bookmarks",
      title: "Saved Reading List",
      description: "Access tutorials and architecture benchmarks saved for later.",
      icon: <Bookmark className="h-5 w-5 text-indigo-600" />,
      href: "/bookmarks",
      cta: "Open Reading List",
      highlight: false,
    },
    {
      id: "topics",
      title: "Explore Tags & Topics",
      description: "Discover trending tech topics across system design, Rust, AI, and Web3.",
      icon: <Layers className="h-5 w-5 text-indigo-600" />,
      href: "/topics",
      cta: "Explore Topics",
      highlight: false,
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Quick Actions Hub
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant entry points into publication, reading, and exploration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + idx * 0.08 }}
            whileHover={{ y: -3 }}
            className={`p-5 rounded-3xl border shadow-2xs transition-all flex flex-col justify-between group cursor-pointer ${
              action.highlight
                ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-900 border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2.5 rounded-2xl border ${
                    action.highlight
                      ? "bg-white/20 border-white/30 text-white"
                      : "bg-indigo-50 border-indigo-100"
                  }`}
                >
                  {action.icon}
                </div>
              </div>

              <div>
                <h4
                  className={`font-heading font-bold text-base mb-1 ${
                    action.highlight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {action.title}
                </h4>
                <p
                  className={`text-xs leading-relaxed line-clamp-2 ${
                    action.highlight ? "text-indigo-100" : "text-slate-500"
                  }`}
                >
                  {action.description}
                </p>
              </div>
            </div>

            <div className={`pt-4 mt-4 border-t ${action.highlight ? "border-white/20" : "border-slate-100"}`}>
              <Link
                href={action.href}
                className={`inline-flex items-center justify-between w-full text-xs font-bold transition ${
                  action.highlight
                    ? "text-white hover:text-indigo-100"
                    : "text-indigo-600 hover:text-indigo-700"
                }`}
              >
                <span>{action.cta}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
