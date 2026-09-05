import Link from "next/link";
import { MessageSquare } from "lucide-react";
import connectDB from "@/lib/mongodb/db";
import { TicketRepository } from "@/modules/tickets";
import { verifyModeratorRequest } from "@/modules/rbac/rbac.guard";

export const dynamic = "force-dynamic";

export default async function ModeratorTicketsPage() {
  const guard = await verifyModeratorRequest();
  if (!guard.authorized) {
    return guard.response;
  }

  await connectDB();
  const ticketRepo = new TicketRepository();
  const rawTickets = await ticketRepo.findAllForStaff();

  // Safely serialize Mongoose / Repository documents into plain JSON primitives
  const tickets = JSON.parse(JSON.stringify(rawTickets));

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl text-slate-900">
            Moderator Support Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Triage, manage, and resolve tenant dispute tickets
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          {tickets.length} Total Tickets
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden divide-y divide-slate-100">
        {tickets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              No active tickets found in queue.
            </p>
          </div>
        ) : (
          tickets.map((t) => (
            <Link
              key={t._id}
              href={`/moderator/tickets/${t._id}`}
              className="flex items-center justify-between p-5 hover:bg-slate-50/80 transition group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition">
                    {t.subject}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      t.status === "open"
                        ? "bg-amber-100 text-amber-700"
                        : t.status === "in_progress"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Tenant:{" "}
                  <span className="font-semibold text-slate-700">
                    {t.tenantId?.name || "Workspace"}
                  </span>{" "}
                  • {t.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-right shrink-0">
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      t.priority === "urgent"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t.priority}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(t.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
