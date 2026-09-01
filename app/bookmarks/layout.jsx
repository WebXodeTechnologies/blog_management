import DashboardLayout from "@/app/dashboard/layout";

export const metadata = {
  title: "Saved Bookmarks | Texora Admin Workspace",
  description: "Saved reading list and technical benchmarks.",
};

export default function BookmarksLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
