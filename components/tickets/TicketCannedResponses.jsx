"use client";

import { Zap } from "lucide-react";

const MACROS = [
  {
    label: "Investigating",
    text: "Thank you for reaching out. Our engineering team is currently investigating this issue.",
  },
  {
    label: "Need Logs",
    text: "Could you please provide a screenshot or the error logs so we can troubleshoot further?",
  },
  {
    label: "Resolved",
    text: "This issue has now been resolved. Please verify and let us know if you need anything else.",
  },
  {
    label: "Pending Info",
    text: "We are waiting for additional information from your side to proceed with this request.",
  },
];

export default function TicketCannedResponses({ onSelect }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-1 scrollbar-none">
      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
        <Zap className="w-3 h-3 text-amber-500" />
        <span>Macros:</span>
      </div>
      {MACROS.map((macro, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(macro.text)}
          className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200/80 rounded-xl px-2.5 py-1 text-[11px] font-medium transition shrink-0 cursor-pointer"
        >
          {macro.label}
        </button>
      ))}
    </div>
  );
}
