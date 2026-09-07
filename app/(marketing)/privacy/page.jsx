import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Texora",
  description:
    "Learn about how Texora protects user data, privacy standards, cookies, and technical information security.",
};

export default function PrivacyPolicyPage() {
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <span>Data Protection &amp; Governance</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Last updated: September 7, 2026. Texora is committed to safeguarding your privacy, technical contributions, and personal identifier data.
        </p>
      </section>

      {/* Policy Content */}
      <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-950 flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-600" />
            1. Information We Collect
          </h2>
          <p>
            When you register an account, publish articles, or interact with Texora workspace services, we collect account details (name, email address, avatar photo), technical logs, browser metadata, and authentication identifiers.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Account Registration Data: Name, email address, password hashes (encrypted using bcrypt).</li>
            <li>Profile Information: Bio, social profile links, customized avatar URLs.</li>
            <li>Publication Content: MDX/HTML articles, comments, bookmarks, and upvote history.</li>
            <li>Technical Metadata: IP addresses, device user agents, session tokens, and cookie logs.</li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-950 flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-600" />
            2. How We Use Your Information
          </h2>
          <p>
            Your data is used solely to operate, secure, and personalize the Texora engineering platform:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>To render published technical papers and developer profiles publicly.</li>
            <li>To calculate platform karma scores, reader engagement, and trending analytics.</li>
            <li>To authenticate users and enforce multi-tenant isolation and role-based permissions.</li>
            <li>To send critical system updates, moderation alerts, and security notifications.</li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-950 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            3. Data Sharing &amp; Third-Party Services
          </h2>
          <p>
            We do not sell, rent, or trade your personal data. We only share information with verified cloud infrastructure providers (MongoDB Atlas, Cloudinary, Vercel) necessary to run Texora.
          </p>
        </section>

        <hr className="border-slate-100" />

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-950 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-600" />
            4. Your Rights &amp; Data Deletion
          </h2>
          <p>
            You have full ownership of your publications and account data. You can edit, unlist, or permanently delete your stories at any time from the Author Dashboard or contact support for complete account erasure.
          </p>
        </section>
      </div>
    </main>
  );
}
