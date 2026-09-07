import Link from "next/link";
import { Compass, Home, Search, Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "404 Page Not Found | Texora",
  description: "The page you are looking for does not exist or has been relocated.",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-xl space-y-6">
        {/* Animated 404 Hero Badge */}
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="h-10 w-10 animate-spin-slow text-indigo-600" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Error 404 • Route Missing</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            The paper, article, or route you are looking for has been moved, unlisted, or does not exist on Texora.
          </p>
        </div>

        {/* Quick Search & Explore Links */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Explore Community</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
          >
            <Home className="h-4 w-4 text-slate-500" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
