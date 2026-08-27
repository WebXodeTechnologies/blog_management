"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import logo from "@/public/logos/logo2.png";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Invalid or missing password reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.03)] relative z-10 font-sans overflow-hidden">
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Brand Logo Header */}
      <div className="flex items-center justify-center mb-6 pt-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Image
            src={logo}
            alt="Texora Logo"
            width={38}
            height={38}
            className="rounded-xl shadow-xs group-hover:scale-105 transition-transform"
          />
          <span className="font-brand font-black text-2xl tracking-tight text-slate-950">
            Texora
          </span>
        </Link>
      </div>

      <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-center text-blue-600 mb-4 shadow-2xs">
        <Lock className="h-6 w-6" />
      </div>

      <h1 className="font-brand font-black text-2xl text-slate-950 mb-2 tracking-tight text-center">
        Create New Password
      </h1>
      <p className="text-xs sm:text-sm font-sans text-slate-600 mb-6 text-center">
        Please enter your secure new password below.
      </p>

      {success ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-sans font-medium flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <span>Password reset successfully! Redirecting you to login...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-sans font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-semibold text-slate-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/90 text-sm font-sans text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/90 text-sm font-sans text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            type="submit"
            disabled={loading || !token}
            className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-sans font-semibold text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-slate-50 text-slate-950 font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Ambient Mesh Light Glow */}
      <div className="absolute top-1/4 right-1/4 w-120 sm:w-150 h-96 sm:h-125 bg-linear-to-tr from-blue-400/15 via-indigo-400/15 to-purple-400/15 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none z-0" />

      <Suspense
        fallback={
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 relative z-10" />
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-full max-w-md"
        >
          <ResetPasswordForm />
        </motion.div>
      </Suspense>
    </div>
  );
}
