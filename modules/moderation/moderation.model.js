import mongoose from "mongoose";

const moderationSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["blog", "comment", "ticket"],
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "contentTypeRef",
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "dismissed", "action_taken"],
      default: "pending",
    },
    moderatorNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

moderationSchema.virtual("contentTypeRef").get(function () {
  if (this.contentType === "blog") return "Blog";
  if (this.contentType === "comment") return "Comment";
  if (this.contentType === "ticket") return "Ticket";
  return "User";
});

export const Moderation =
  mongoose.models.Moderation || mongoose.model("Moderation", moderationSchema);
