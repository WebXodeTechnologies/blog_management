import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";

export async function GET(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const logs = await AuditLog.find()
      .populate("actorId", "name email avatar role")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ logs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
