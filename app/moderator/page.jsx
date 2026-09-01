import { redirect } from "next/navigation";

export default function ModeratorPageRedirect() {
  redirect("/dashboard/articles");
}
