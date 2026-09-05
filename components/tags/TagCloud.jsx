"use client";

import { useState, useEffect } from "react";
import { Hash, Loader2 } from "lucide-react";

export default function TagCloud({ selectedTag, onSelectTag }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/tags")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTags(data.tags);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-4">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
      </div>
    );
  if (tags.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Hash className="w-4 h-4 text-indigo-600" />
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Popular Tech Tags
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectTag(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            !selectedTag
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Topics
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedTag === tag
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
