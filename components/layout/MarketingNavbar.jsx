"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PenTool,
  ArrowRight,
  Menu,
  X,
  Compass,
  BookOpen,
  Layers,
} from "lucide-react";
import logo from "@/public/logos/logo2.png";
import Image from "next/image";

export default function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Floating Glassmorphic Header Wrapper */}
      <header className="sticky top-0 z-40 w-full pt-4 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="h-16 px-5 sm:px-6 rounded-2xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_3px_rgb(0,0,0,0.02)] flex items-center justify-between transition-all">
            {/* Brand Wordmark */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src={logo}
                alt="texora"
                width={40}
                height={40}
                className="rounded-md"
              />
              <h1 className="font-black text-2xl tracking-tight">Texora</h1>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <Link
                href="/explore"
                className="flex items-center gap-1.5 hover:text-slate-950 transition-colors"
              >
                <Compass className="h-4 w-4 text-slate-500" />
                <span>Explore</span>
              </Link>
              <Link
                href="/articles"
                className="flex items-center gap-1.5 hover:text-slate-950 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span>Articles</span>
              </Link>
              <Link
                href="/topics"
                className="flex items-center gap-1.5 hover:text-slate-950 transition-colors"
              >
                <Layers className="h-4 w-4 text-slate-500" />
                <span>Topics</span>
              </Link>
              <Link
                href="/dashboard/tech-pulse/blog/create"
                className="flex items-center gap-1.5 hover:text-slate-950 transition-colors"
              >
                <PenTool className="h-3.5 w-3.5 text-blue-600" />
                <span>Write</span>
              </Link>
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs hover:shadow transition-all group"
              >
                <span>Start Xplore</span>
                <ArrowRight className="h-3 w-3 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-white/60 bg-white/60 text-slate-800 hover:bg-white transition shadow-2xs"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Glassmorphic Slide-over Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Darkened Blur Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Panel */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out border-l border-white/80 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src={logo}
                alt="Texora"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="font-brand font-black text-xl tracking-tight text-slate-950">
                Texora
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg border border-white/80 bg-white/60 text-slate-500 hover:text-slate-950 hover:bg-white transition"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body Links */}
          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-white/60 rounded-xl transition"
            >
              <Compass className="h-4 w-4 text-slate-500" />
              <span>Explore</span>
            </Link>

            <Link
              href="/articles"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-white/60 rounded-xl transition"
            >
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span>Articles</span>
            </Link>

            <Link
              href="/topics"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-white/60 rounded-xl transition"
            >
              <Layers className="h-4 w-4 text-slate-500" />
              <span>Topics</span>
            </Link>

            <Link
              href="/dashboard/tech-pulse/blog/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-white/60 rounded-xl transition"
            >
              <PenTool className="h-4 w-4 text-blue-600" />
              <span>Write</span>
            </Link>

            <div className="pt-2 pb-1 border-t border-slate-200/60 my-2"></div>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-white/60 rounded-xl transition"
            >
              Sign in
            </Link>
          </div>

          {/* Drawer Footer CTA */}
          <div className="p-5 border-t border-slate-100/80 bg-white/40 space-y-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-3 text-xs font-semibold bg-slate-950 text-white rounded-xl hover:bg-slate-800 shadow-xs transition"
            >
              <span>Start Xplore</span> <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
