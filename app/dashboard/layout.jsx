import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import MarketingNavbar from "@/components/layout/MarketingNavbar";

export const metadata = {
  title: "Dashboard | Texora Developer Workspace",
  description: "User workspace for articles, bookmarks, and account profile.",
};

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?callbackUrl=/dashboard/profile");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
  } catch (err) {
    redirect("/login?callbackUrl=/dashboard/profile");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <MarketingNavbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
