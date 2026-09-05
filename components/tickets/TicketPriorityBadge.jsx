import { AlertCircle, ArrowUp, Zap, ShieldAlert } from "lucide-react";

const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    color: "text-slate-600 bg-slate-100 border-slate-200",
    icon: AlertCircle,
  },
  medium: {
    label: "Medium",
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
    icon: ArrowUp,
  },
  high: {
    label: "High",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    icon: Zap,
  },
  urgent: {
    label: "Urgent",
    color: "text-rose-700 bg-rose-50 border-rose-200",
    icon: ShieldAlert,
  },
};

export default function TicketPriorityBadge({ priority = "medium" }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}
