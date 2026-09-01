"use client";

import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  Quote,
  List,
  Code,
} from "lucide-react";

export default function EditorToolbar({ onAddCodeBlock }) {
  return (
    <div className="sticky top-14 sm:top-16 z-30 p-1.5 sm:p-2 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center gap-1 overflow-x-auto scrollbar-none select-none">
      <button
        type="button"
        className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>

      <div className="h-5 w-px bg-slate-800 mx-1 shrink-0" />

      {/* Code Block Insert Button */}
      <button
        type="button"
        onClick={onAddCodeBlock}
        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0 ml-auto"
      >
        <Code className="h-3.5 w-3.5" />
        <span>+ Code Block</span>
      </button>
    </div>
  );
}
