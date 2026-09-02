import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "invited", "revoked"],
      default: "active",
    },
  },
  { timestamps: true }
);

MembershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true });

export const Membership =
  mongoose.models.Membership || mongoose.model("Membership", MembershipSchema);
