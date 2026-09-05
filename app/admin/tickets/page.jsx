import Link from "next/link";
import { MessageSquare, Building2 } from "lucide-react";
import connectDB from "@/lib/mongodb/db";
import { TicketRepository } from "@/modules/tickets";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import AdminMetricsGrid from "@/components/tickets/AdminMetricsGrid";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const guard = await verifyAdminRequest();
  if (!guard.authorized) {
    return guard.response;
  }

  await connectDB();
  const ticketRepo = new TicketRepository();

  const [rawTickets, rawMetrics] = await Promise.all([
    ticketRepo.findAllForStaff(),
    ticketRepo.getMetrics(),
  ]);

  // Safely serialize database documents and metrics to plain JSON objects
  const tickets = JSON.parse(JSON.stringify(rawTickets));
  const metrics = JSON.parse(JSON.stringify(rawMetrics));

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl text-slate-900">
            Global Admin Ticket Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor and manage all support and dispute tickets across tenants
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold font-mono">
          {tickets.length} System Tickets
        </div>
      </div>

      {/* Admin KPI Metrics Grid */}
      <AdminMetricsGrid metrics={metrics} />

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden divide-y divide-slate-100">
        {tickets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              No tickets recorded in the platform database.
            </p>
          </div>
        ) : (
          tickets.map((t) => (
            <Link
              key={t._id}
              href={`/admin/tickets/${t._id}`}
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
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-indigo-600">
                    <Building2 className="h-3 w-3" />
                    {t.tenantId?.name || "Global Tenant"}
                  </span>
                  <span>•</span>
                  <span className="line-clamp-1">{t.description}</span>
                </div>
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
