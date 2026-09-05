import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { TicketService } from "@/modules/tickets";
import { verifyUserRequest } from "@/modules/rbac/rbac.guard";
import { Notification } from "@/modules/notifications/notification.model";

const ticketService = new TicketService();

export async function POST(req, { params }) {
  const { id: ticketId } = await params;
  const guard = await verifyUserRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    await connectDB();
    const body = await req.json();
    const { message } = body;

    const messageText =
      typeof message === "string" ? message : message?.message;

    if (!messageText || !messageText.trim()) {
      return NextResponse.json(
        { success: false, error: "Message content required" },
        { status: 400 }
      );
    }

    const io = global.io;

    // Save message via service
    const updatedTicket = await ticketService.postMessage(
      io,
      ticketId,
      guard.user._id,
      messageText.trim()
    );

    if (!updatedTicket) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    const latestMessage =
      updatedTicket.messages[updatedTicket.messages.length - 1];

    // Wrap notification creation in a safe block so schema validation mismatches won't break chat replies
    try {
      const recipientId =
        updatedTicket.creatorId?._id?.toString() ===
          guard.user._id.toString() ||
        updatedTicket.creatorId?.toString() === guard.user._id.toString()
          ? updatedTicket.assignedTo || null
          : updatedTicket.creatorId;

      if (recipientId && recipientId.toString() !== guard.user._id.toString()) {
        await Notification.create({
          recipientId,
          actorId: guard.user._id,
          title: "New Ticket Reply", // Added required title field
          type: "system", // Adjusted to standard enum type (or update to match your Notification model's allowed enum values)
          message: `New reply on ticket: "${updatedTicket.subject}"`,
          link: `/dashboard/tickets/${ticketId}`,
        });
      }
    } catch (notifErr) {
      console.warn(
        "⚠️ Non-critical notification creation skipped:",
        notifErr.message
      );
    }

    return NextResponse.json(
      { success: true, ticket: updatedTicket, message: latestMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [POST /api/v1/tickets/messages] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
