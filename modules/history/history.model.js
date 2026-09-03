import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensures a user only has one unique history entry per blog, updating the timestamp on revisit
historySchema.index({ userId: 1, blogId: 1 }, { unique: true });

export const History =
  mongoose.models.History || mongoose.model("History", historySchema);
