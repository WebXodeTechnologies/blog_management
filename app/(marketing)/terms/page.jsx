import Link from "next/link";
import { FileText, ShieldAlert, Scale, CheckSquare, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Texora",
  description:
    "Review the terms of service, acceptable use policies, and publishing guidelines for Texora.",
};

export default function TermsAndConditionsPage() {
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
          <Scale className="h-4 w-4 text-indigo-600" />
          <span>Platform Service Agreement</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Effective date: September 7, 2026. By accessing or publishing on Texora, you agree to these legally binding platform terms.
        </p>
      </section>

      {/* Terms Content */}
      <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-950 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-600" />
            1. Acceptable Use &amp; Code of Conduct
          </h2>
          <p>
            Texora is designed for technical contributors, founders, and software engineers. Users must not publish malicious scripts, unauthorized code exploits, spam, plagiarized content, or abusive materials.
          </p>
        </section>

        <hr className="border-slate-100" />

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-950 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            2. Content Ownership &amp; Licensing
          </h2>
          <p>
            Authors retain 100% intellectual property rights over articles published on Texora. By submitting content, you grant Texora a non-exclusive license to host, display, and format your stories for public distribution across our platform.
          </p>
        </section>

        <hr className="border-slate-100" />

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-950 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600" />
            3. Moderation &amp; Content Removal
          </h2>
          <p>
            Texora moderators reserve the right to review, request edits for, or unlist any submission that violates safety standards or copyright policies.
          </p>
        </section>

        <hr className="border-slate-100" />

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-950 flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-600" />
            4. Limitation of Liability
          </h2>
          <p>
            Texora is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for indirect damages or technical interruptions resulting from external dependencies.
          </p>
        </section>
      </div>
    </main>
  );
}
