import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
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
    quote: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

export const Highlight =
  mongoose.models.Highlight || mongoose.model("Highlight", highlightSchema);
