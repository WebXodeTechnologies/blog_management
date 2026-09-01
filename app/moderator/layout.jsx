import { redirect } from "next/navigation";

export default function ModeratorLayoutRedirect({ children }) {
  redirect("/dashboard/articles");
}
