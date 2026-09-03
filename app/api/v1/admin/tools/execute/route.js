import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";

export async function POST(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const { action } = await req.json();

    await AuditLog.create({
      actorId: guard.user._id,
      action: `ROOT_TOOL_${action?.toUpperCase().replace(/-/g, "_")}`,
      entityType: "System",
      details: { executedAt: new Date() },
    });

    return NextResponse.json(
      { success: true, message: "Root action completed successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to execute root operation" },
      { status: 500 }
    );
  }
}
