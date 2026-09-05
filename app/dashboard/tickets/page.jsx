import Link from "next/link";
import { Plus, MessageSquare, Clock, AlertCircle } from "lucide-react";
import connectDB from "@/lib/mongodb/db";
import { Ticket } from "@/modules/tickets";
import { verifyUserRequest } from "@/modules/rbac/rbac.guard";

export default async function TicketsPage() {
  const guard = await verifyUserRequest();
  if (!guard.authorized) {
    return guard.response;
  }

  await connectDB();
  const tickets = await Ticket.find({ creatorId: guard.user._id })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl text-slate-900">
            Dispute & Support Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your active support requests and live chat channels
          </p>
        </div>
        <Link
          href="/dashboard/tickets/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Ticket</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden divide-y divide-slate-100">
        {tickets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              No tickets found. Create one to start a live support chat.
            </p>
          </div>
        ) : (
          tickets.map((t) => (
            <Link
              key={t._id.toString()}
              href={`/dashboard/tickets/${t._id.toString()}`}
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
                  {t.description}
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
