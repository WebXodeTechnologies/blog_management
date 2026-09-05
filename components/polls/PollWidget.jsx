"use client";

import { useState } from "react";
import { BarChart3, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PollWidget({ poll, currentUserId }) {
  const [pollData, setPollData] = useState(poll);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);

  const hasVoted = pollData.votedUsers?.includes(currentUserId);
  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = async () => {
    if (selectedOption === null || voting || hasVoted) return;

    setVoting(true);
    const toastId = toast.loading("Submitting vote...");

    try {
      const res = await fetch(`/api/v1/polls/${pollData._id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedOption }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setPollData(data.poll);
      toast.success("Vote recorded successfully!", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Failed to submit vote", { id: toastId });
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Community Poll
          </h3>
          <h2 className="font-bold text-sm text-slate-900 mt-0.5">
            {pollData.question}
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {pollData.options.map((opt) => {
          const percentage =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isSelected = selectedOption === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => !hasVoted && setSelectedOption(opt.id)}
              className={`relative overflow-hidden rounded-2xl border p-4 transition cursor-pointer ${
                hasVoted
                  ? "border-slate-200 bg-slate-50/50 cursor-default"
                  : isSelected
                    ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              {/* Progress background bar when voted */}
              {hasVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-100/60 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!hasVoted && (
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {opt.label}
                  </span>
                </div>

                {hasVoted && (
                  <span className="text-xs font-bold text-indigo-600 font-mono">
                    {percentage}% ({opt.votes})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!hasVoted && (
        <button
          type="button"
          onClick={handleVote}
          disabled={selectedOption === null || voting}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm shadow-indigo-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {voting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Submit Vote</span>
        </button>
      )}

      {hasVoted && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>Thank you for voting! Total votes: {totalVotes}</span>
        </div>
      )}
    </div>
  );
}
