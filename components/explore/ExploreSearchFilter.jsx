"use client";

import { CATEGORY_NAMES } from "@/constants/categories";

export default function ExploreSearchFilter({
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden pb-4 mb-6 border-b border-slate-200/60 font-sans [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORY_NAMES.map((catName, idx) => {
        const isActive =
          selectedCategory === catName ||
          (selectedCategory === "All" && catName === "All");
        return (
          <button
            key={idx}
            onClick={() => setSelectedCategory(catName)}
            className={`text-xs font-sans px-4 py-2 rounded-full transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              isActive
                ? "bg-slate-950 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 border border-slate-200/60 bg-white/70"
            }`}
          >
            {catName}
          </button>
        );
      })}
    </div>
  );
}
