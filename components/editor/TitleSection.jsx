"use client";

import { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function TitleSection({
  title,
  subtitle,
  onTitleChange,
  onSubtitleChange,
}) {
  const textareaRef = useRef(null);

  // Auto-expand title textarea dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [title]);

  return (
    <div className="space-y-2.5 sm:space-y-5 font-sans">
      {/* Title Input Field */}
      <div>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Title of the story..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-2xl  font-sans font-black text-slate-950 placeholder:text-slate-300 bg-transparent border-none focus:outline-none resize-none leading-snug tracking-tight overflow-hidden transition-all"
        />
      </div>

      {/* Subtitle / Brief Summary Input Field */}
      <div className="pt-0.5">
        <input
          type="text"
          placeholder="Subtitle/intro"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          className="w-full text-sm sm:text-base font-medium text-slate-600 placeholder:text-slate-400 bg-transparent border-none focus:outline-none leading-relaxed transition-all"
        />
      </div>

      {/* Neat & Clean SEO Character Counter */}
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-100/80">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          <span>SEO Title Counter</span>
        </span>
        <span
          className={`font-mono font-bold ${
            title.length > 80 ? "text-amber-600" : "text-slate-400"
          }`}
        >
          {title.length} / 80 chars
        </span>
      </div>
    </div>
  );
}
