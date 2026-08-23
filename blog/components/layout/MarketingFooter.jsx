import Link from "next/link";
import { Zap, Heart } from "lucide-react";

export default function MarketingFooter() {
  return (
    <footer className="w-full py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Glassmorphic Shell Card */}
        <div className="rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_3px_rgb(0,0,0,0.02)] p-8 sm:p-12 space-y-10">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Col 1: Brand & Bio */}
            <div className="space-y-3 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                </div>
                <span className="font-heading font-extrabold text-lg tracking-wider text-slate-950">
                  TEXORA
                </span>
              </Link>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Next-gen developer publishing, karma discussions, and real-time
                community rooms.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-900 font-mono">
                Platform
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li>
                  <Link
                    href="#our-story"
                    className="hover:text-slate-950 transition-colors"
                  >
                    Our story
                  </Link>
                </li>
                <li>
                  <Link
                    href="#membership"
                    className="hover:text-slate-950 transition-colors"
                  >
                    Membership
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/tech-pulse/blog/create"
                    className="hover:text-slate-950 transition-colors"
                  >
                    Write a story
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-900 font-mono">
                Legal
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-slate-950 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-slate-950 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="hover:text-slate-950 transition-colors"
                  >
                    Security & Trust
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Social SVGs */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-900 font-mono">
                Connect
              </p>
              <div className="flex items-center gap-3 text-slate-500">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200 hover:text-slate-950 transition-colors shadow-2xs"
                  aria-label="GitHub"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200 hover:text-slate-950 transition-colors shadow-2xs"
                  aria-label="X"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200 hover:text-slate-950 transition-colors shadow-2xs"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Divider & Credit Row */}
          <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} TEXORA. All rights reserved.</p>

            {/* Centered Developer Credit */}
            <div className="inline-flex items-center gap-1.5 font-medium text-slate-600">
              <span>Developed with</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>by</span>
              <a
                href="https://www.webxode.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-900 hover:text-blue-600 transition-colors underline decoration-slate-300 underline-offset-4"
              >
                Webxode Technologies
              </a>
            </div>

            <p className="font-mono text-[11px] text-slate-400">
              v2.4.0-stable
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
