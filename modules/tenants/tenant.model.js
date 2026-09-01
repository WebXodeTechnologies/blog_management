import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Tenant slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    domain: {
      type: String,
      default: "",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    settings: {
      theme: { type: String, default: "light" },
      logo: { type: String, default: "" },
      customCss: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Tenant =
  mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);
