import Link from "next/link";
import { ShieldCheck, Lock, Server, Cpu, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Security & Trust | Texora",
  description:
    "Discover Texora's security architecture, JWT authentication, multi-tenant isolation, and data encryption standards.",
};

export default function SecurityTrustPage() {
  return (
    <main className="min-h-screen text-slate-900 font-sans pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-8 sm:pt-12">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      {/* Header Banner */}
      <section className="bg-white/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Enterprise Security Architecture</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
          Security &amp; Trust Center
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
          How Texora safeguards technical data with zero-trust architecture, encrypted sessions, strict tenant isolation, and RBAC controls.
        </p>
      </section>

      {/* Security Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-950">
            End-to-End Session Encryption
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All user sessions use JSON Web Tokens (JWT) stored in HTTP-Only, SameSite, Secure cookies to eliminate XSS and CSRF attack vectors.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Server className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-950">
            Multi-Tenant Data Isolation
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Database documents enforce strict tenant ID scoping, ensuring workspace content remains fully isolated between standard users, moderators, and root admins.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <KeyRound className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-950">
            Bcrypt Hash Protection
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            User credentials are stored as salted bcrypt hashes. Plaintext passwords are never logged, cached, or transmitted across raw channels.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-950">
            Automated Audit Logging
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Critical actions (role escalation, story moderation, ticket resolution) trigger immutable system audit logs for administrative oversight.
          </p>
        </div>
      </div>

      {/* Compliance Box */}
      <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-base text-slate-950 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Vulnerability Reporting
          </h4>
          <p className="text-xs text-slate-600">
            Found a security issue? Report it directly to our security response team at <span className="font-semibold text-slate-900">security@webxode.com</span>.
          </p>
        </div>
        <Link
          href="/dashboard/tickets"
          className="px-5 py-2.5 rounded-2xl bg-slate-950 text-white text-xs font-semibold hover:bg-indigo-600 transition shrink-0 shadow-xs"
        >
          Submit Ticket
        </Link>
      </div>
    </main>
  );
}
