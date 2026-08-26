import Link from "next/link";
import Image from "next/image";
import { Heart, Send, CheckCircle2 } from "lucide-react";
import logo from "@/public/logos/logo2.png";

export default function MarketingFooter() {
  return (
    <footer className="w-full py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Glassmorphic Shell Card */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-8 sm:p-12 space-y-12">
          {/* Top Hero Strip: Brand Info & Newsletter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-100/90">
            {/* Brand & Bio */}
            <div className="space-y-3 max-w-md">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src={logo}
                  alt="Texora Logo"
                  width={42}
                  height={42}
                  className="rounded-lg shadow-xs group-hover:scale-105 transition-transform duration-200"
                />
                <h1 className="font-brand font-black text-2xl sm:text-3xl tracking-tight text-slate-950">
                  Texora
                </h1>
              </Link>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                The premier developer publishing platform for deep technical
                stories, system design insights, and real-time community aura.
              </p>
              {/* Live Status Indicator Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-sans font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational • 99.99% Uptime</span>
              </div>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="w-full lg:w-auto max-w-md bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
              <h4 className="font-heading font-bold text-sm text-slate-950 mb-1">
                Subscribe to Tech Pulse Weekly
              </h4>
              <p className="text-xs text-slate-500 font-sans mb-3">
                Curated system design guides & engineering stories delivered to
                your inbox.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2"
              >
                <input
                  type="email"
                  placeholder="enter your email..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-sans font-semibold hover:bg-blue-600 shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <span>Join</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Col 1: Product */}
            <div className="space-y-3">
              <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-950">
                Product
              </h5>
              <ul className="space-y-2 text-xs font-sans font-medium text-slate-600">
                <li>
                  <Link
                    href="/dashboard/tech-pulse/blog/create"
                    className="hover:text-blue-600 transition-colors"
                  >
                    MDX Technical Editor
                  </Link>
                </li>
                <li>
                  <Link
                    href="#custom-domains"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Custom Domains & SSL
                  </Link>
                </li>
                <li>
                  <Link
                    href="#karma"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Karma & Upvotes
                  </Link>
                </li>
                <li>
                  <Link
                    href="#discussions"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Community Aura Rooms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Topics */}
            <div className="space-y-3">
              <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-950">
                Explore Topics
              </h5>
              <ul className="space-y-2 text-xs font-sans font-medium text-slate-600">
                <li>
                  <Link
                    href="/topics"
                    className="hover:text-blue-600 transition-colors"
                  >
                    System Design
                  </Link>
                </li>
                <li>
                  <Link
                    href="/topics"
                    className="hover:text-blue-600 transition-colors"
                  >
                    AI Pipelines & ML
                  </Link>
                </li>
                <li>
                  <Link
                    href="/topics"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/topics"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Founder Notes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-3">
              <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-950">
                Resources
              </h5>
              <ul className="space-y-2 text-xs font-sans font-medium text-slate-600">
                <li>
                  <Link
                    href="/articles"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Featured Articles
                  </Link>
                </li>
                <li>
                  <Link
                    href="#docs"
                    className="hover:text-blue-600 transition-colors"
                  >
                    API Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    GitHub Open Source
                  </a>
                </li>
                <li>
                  <Link
                    href="#status"
                    className="hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    <span>System Status</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Social */}
            <div className="space-y-3">
              <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-950">
                Legal & Security
              </h5>
              <ul className="space-y-2 text-xs font-sans font-medium text-slate-600 mb-4">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Security & Trust
                  </Link>
                </li>
              </ul>

              {/* Social SVG Links */}
              <div className="flex items-center gap-2.5 text-slate-500">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100/90 hover:bg-slate-950 hover:text-white transition-colors shadow-2xs"
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
                  className="p-2 rounded-xl bg-slate-100/90 hover:bg-slate-950 hover:text-white transition-colors shadow-2xs"
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
                  className="p-2 rounded-xl bg-slate-100/90 hover:bg-slate-950 hover:text-white transition-colors shadow-2xs"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Credit Row */}
          <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-slate-500">
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
