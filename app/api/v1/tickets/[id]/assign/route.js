import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { TicketService } from "@/modules/tickets";
import { verifyUserRequest } from "@/modules/rbac/rbac.guard";

const ticketService = new TicketService();

export async function PATCH(req, { params }) {
  const { id: ticketId } = await params;
  const guard = await verifyUserRequest(req);
  if (!guard.authorized) return guard.response;

  if (guard.user.role !== "admin" && guard.user.role !== "staff") {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    const body = await req.json();
    const { assignedTo } = body;

    const io = global.io;
    const updatedTicket = await ticketService.assignTicket(
      io,
      ticketId,
      assignedTo || null,
      guard.user._id
    );

    if (!updatedTicket) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, ticket: updatedTicket },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [PATCH /api/v1/tickets/assign] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
