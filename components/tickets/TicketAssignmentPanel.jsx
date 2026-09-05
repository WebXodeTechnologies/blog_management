"use client";

import { useState } from "react";
import { UserCheck, Loader2, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function TicketAssignmentPanel({
  ticketId,
  staffList = [],
  currentAssigned,
  onAssigned,
}) {
  const [assignedAgent, setAssignedAgent] = useState(
    currentAssigned?._id || ""
  );
  const [updating, setUpdating] = useState(false);

  const handleAssignmentChange = async (agentId) => {
    if (updating) return;
    setUpdating(true);
    const toastId = toast.loading("Updating assignment...");

    try {
      const res = await fetch(`/api/v1/tickets/${ticketId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: agentId || null }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error);

      setAssignedAgent(agentId);
      if (onAssigned) onAssigned(data.ticket.assignedTo);
      toast.success("Agent assigned successfully!", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Failed to assign agent", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">
            Support Routing & Assignment
          </h4>
          <p className="text-[11px] text-slate-500">
            Route this inquiry to a specific staff agent
          </p>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <select
          value={assignedAgent}
          onChange={(e) => handleAssignmentChange(e.target.value)}
          disabled={updating}
          className="w-full appearance-none bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition cursor-pointer disabled:opacity-50"
        >
          <option value="">Unassigned</option>
          {staffList.map((staff) => (
            <option key={staff._id} value={staff._id}>
              {staff.name} ({staff.role})
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          {updating ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
}
