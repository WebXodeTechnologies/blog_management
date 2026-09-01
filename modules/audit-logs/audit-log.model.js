import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g. "USER_ROLE_UPDATED", "TENANT_CREATED", "CATEGORY_DELETED"
    },
    entityType: {
      type: String, // e.g. "User", "Tenant", "Category", "Blog"
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
