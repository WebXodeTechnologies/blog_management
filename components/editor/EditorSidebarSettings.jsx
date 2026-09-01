"use client";

import { Tag, Sparkles, BookOpen, User, CheckCircle2, X } from "lucide-react";

export default function EditorSidebarSettings({
  user,
  title,
  subtitle,
  category,
  categories,
  tags,
  tagInput,
  readTimeMin,
  wordCount,
  onCategoryChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}) {
  return (
    <div className="space-y-6 font-sans select-none">
      {/* 1. Live Article Card Preview */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <span>Live Article Preview</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Preview Mode
          </span>
        </div>

        {/* Live Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
              {category}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {readTimeMin} min read
            </span>
          </div>

          <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
            {title || "Untitled Technical Story"}
          </h4>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {subtitle || "No summary intro specified..."}
          </p>

          <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt={user?.name || "Author"}
              className="w-6 h-6 rounded-full object-cover border border-indigo-200"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">
                {user?.name || "Anonymous Author"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Publication Category & Tags */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-indigo-600" />
          <span>Publishing Settings</span>
        </h4>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Category Domain
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-950 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Tags (Press Enter)
          </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Add tag and press Enter..."
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              onKeyDown={onAddTag}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-950 font-medium focus:outline-none focus:border-indigo-600"
            />
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100 flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(t)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Author Verification Badge Card */}
      <div className="bg-linear-to-br from-indigo-50/80 to-slate-50 rounded-3xl border border-indigo-100 p-5 space-y-2">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
          <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>Verified Author Account</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          Your published articles will feature your author profile card and automatically credit your contributions.
        </p>
      </div>
    </div>
  );
}
