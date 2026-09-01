"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import logo from "@/public/logos/logo2.png";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = callbackUrl;
      } else {
        setError(data.message || "Invalid administrator credentials");
      }
    } catch (err) {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{error}</div>
        </div>
      )}

      {/* Credentials Form (No Google OAuth) */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Email / Username Field */}
        <div className="space-y-1.5">
          <label className="text-slate-700 font-semibold tracking-wide flex items-center justify-between">
            <span>Administrator Email</span>
            <span className="text-[10px] text-slate-400 font-mono">
              ROOT AUTH
            </span>
          </label>
          <div className="relative">
            <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@texora.com"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all text-xs"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-slate-700 font-semibold tracking-wide flex items-center justify-between">
            <span>Password</span>
            <span className="text-[10px] text-slate-400 font-mono">
              SECURE ACCESS
            </span>
          </label>
          <div className="relative">
            <KeyRound className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2.5 p-3 bg-slate-100/70 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 font-medium">
          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Restricted to authorized system administrators only.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-950/10 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Shared Ambient Soft Light Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-linear-to-tr from-blue-300/20 via-indigo-300/20 to-purple-300/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-linear-to-tr from-slate-200/30 to-blue-200/30 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Top Header Back Link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between relative z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>User Login</span>
        </Link>
        <div className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Texora"
            width={22}
            height={22}
            className="rounded-md"
          />
          <span className="font-bold text-xs text-slate-900 tracking-tight">
            Texora Core
          </span>
        </div>
      </div>

      {/* Main Admin Light Theme Card */}
      <div className="w-full max-w-md bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative z-10 backdrop-blur-xl space-y-6 overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-slate-900 via-indigo-600 to-blue-600" />

        {/* Header Section */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 text-white shadow-md ring-4 ring-slate-100">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign in with your administrator credentials
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-900 mb-2" />
              <p className="text-xs">Loading Admin Portal...</p>
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>

        {/* Footer Note */}
        <div className="pt-2 text-center text-[11px] text-slate-400 font-medium">
          Texora Platform • Root Security Gateway
        </div>
      </div>
    </div>
  );
}
