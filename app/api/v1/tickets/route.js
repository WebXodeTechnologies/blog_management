import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { TicketService } from "@/modules/tickets";
import { verifyUserRequest } from "@/modules/rbac/rbac.guard";
import { Notification } from "@/modules/notifications/notification.model";

const ticketService = new TicketService();

export async function GET(req) {
  try {
    await connectDB();
    const guard = await verifyUserRequest(req);
    if (!guard.authorized) return guard.response;

    const { searchParams } = new URL(req.url);
    const tenantIdParam = searchParams.get("tenantId");
    const search = searchParams.get("search") || "";
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";

    const targetTenantId =
      tenantIdParam || guard.user.tenantId || guard.user._id;

    const result = await ticketService.getTenantTickets(targetTenantId, {
      search,
      page,
      limit,
      status,
      priority,
    });

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error("🔥 [GET /api/v1/tickets] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const guard = await verifyUserRequest(req);
    if (!guard.authorized) return guard.response;

    const body = await req.json();
    const { tenantId, subject, description, category, priority } = body;

    const activeTenantId = tenantId || guard.user.tenantId || guard.user._id;

    if (!subject?.trim() || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Subject and description are required" },
        { status: 400 }
      );
    }

    const newTicket = await ticketService.createTicket({
      tenantId: activeTenantId,
      creatorId: guard.user._id,
      subject: subject.trim(),
      description: description.trim(),
      category: category || "general",
      priority: priority || "medium",
      messages: [{ senderId: guard.user._id, message: description.trim() }],
    });

    try {
      await Notification.create({
        recipientId: guard.user._id,
        actorId: guard.user._id,
        type: "ticket_created",
        message: `Support ticket opened: "${subject.trim()}"`,
        link: `/dashboard/tickets/${newTicket._id}`,
      });

      if (global.io) {
        global.io.to(`ticket_${newTicket._id}`).emit("receive_ticket_message", {
          ticketId: newTicket._id,
          message: newTicket.messages[0],
        });
      }
    } catch (sideEffectErr) {
      console.warn(
        "⚠️ Non-critical notification/socket error during ticket creation:",
        sideEffectErr
      );
    }

    return NextResponse.json(
      { success: true, ticket: newTicket },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 [POST /api/v1/tickets] Detailed Server Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
