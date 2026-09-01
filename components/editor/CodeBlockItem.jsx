"use client";

import { Code, Trash2 } from "lucide-react";

export default function CodeBlockItem({
  block,
  index,
  languages,
  onUpdateCodeBlock,
  onRemoveCodeBlock,
}) {
  return (
    <div className="rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden shadow-xl">
      {/* Code Block Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Code className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-300 truncate">
            Code Snippet #{index + 1}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={block.language}
            onChange={(e) =>
              onUpdateCodeBlock(block.id, "language", e.target.value)
            }
            className="bg-slate-950 text-indigo-400 border border-slate-800 text-xs font-mono font-bold rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onRemoveCodeBlock(block.id)}
            className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition cursor-pointer"
            title="Delete Code Block"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Code Textarea */}
      <textarea
        rows={6}
        value={block.code}
        onChange={(e) =>
          onUpdateCodeBlock(block.id, "code", e.target.value)
        }
        className="w-full p-3.5 sm:p-4 bg-slate-950 font-mono text-xs text-indigo-300 focus:outline-none resize-none leading-relaxed"
      />
    </div>
  );
}
