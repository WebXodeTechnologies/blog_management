import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { TicketRepository } from "@/modules/tickets";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";

export async function GET(req) {
  try {
    await connectDB();
    const guard = await verifyAdminRequest();
    if (!guard.authorized) return guard.response;

    const ticketRepo = new TicketRepository();
    const metrics = await ticketRepo.getMetrics(); // pass tenantId if multi-tenant filtered

    return NextResponse.json({ success: true, metrics }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
