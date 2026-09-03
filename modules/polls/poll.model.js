import mongoose from "mongoose";

const PollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    active: { type: Boolean, default: true },
    options: [
      {
        id: { type: Number, required: true },
        label: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],
    votedUsers: [{ type: String }], // Tracks user IDs or IPs to prevent duplicate voting
  },
  { timestamps: true }
);

export const Poll = mongoose.models.Poll || mongoose.model("Poll", PollSchema);
