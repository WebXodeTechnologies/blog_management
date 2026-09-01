"use client";

import { useState } from "react";
import { Tag, ChevronDown, ChevronUp, X } from "lucide-react";

export default function PublicationMetadata({
  category,
  categories,
  tags,
  tagInput,
  onCategoryChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-4 border-t border-slate-100 font-sans">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-indigo-600" />
          <span>Publication Category &amp; Tags</span>
          <span className="text-[10px] font-normal text-slate-400">
            ({category} • #{tags.join(", #")})
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 pb-2">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Category Tag
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
              Add Tags (Press Enter)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Type tag and press Enter..."
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
      )}
    </div>
  );
}
