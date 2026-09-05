import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldAlert,
  Layers,
} from "lucide-react";

export default function AdminMetricsGrid({ metrics }) {
  const total = metrics?.totalTickets?.[0]?.count || 0;
  const statusCounts =
    metrics?.byStatus?.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      {}
    ) || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Tickets
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{total}</h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Open Tickets
          </p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-1">
            {statusCounts.open || 0}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            In Progress
          </p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">
            {statusCounts.in_progress || 0}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Resolved
          </p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">
            {statusCounts.resolved || 0}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
