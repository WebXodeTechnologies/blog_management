import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { verifyUserRequest } from "@/modules/rbac/rbac.guard";
import { TicketService } from "@/modules/tickets/ticket.service";

const ticketService = new TicketService();

export async function PATCH(req, { params }) {
  const { id: ticketId } = await params;
  const guard = await verifyUserRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    await connectDB();
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const io = global.io;
    const updatedTicket = await ticketService.updateStatus(
      io,
      ticketId,
      status,
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
    console.error("🔥 [PATCH /api/v1/tickets/status] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
