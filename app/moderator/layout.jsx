import DashboardLayout from "@/app/dashboard/layout";

export const metadata = {
  title: "Moderator Control Center | Texora Admin Workspace",
  description: "Moderator queue, reported items, and safety enforcement workspace.",
};

export default function ModeratorLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
