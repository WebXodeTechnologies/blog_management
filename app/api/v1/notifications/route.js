import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { NotificationService } from "@/modules/notifications";
import { verifyUserRequest } from "@/modules/rbac/rbac.guard";

const notificationService = new NotificationService();

export async function GET(req) {
  const guard = await verifyUserRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    await connectDB();
    const notifications = await notificationService.getUserNotifications(
      guard.user._id
    );
    return NextResponse.json({ success: true, notifications }, { status: 200 });
  } catch (error) {
    console.error("🔥 [GET /api/v1/notifications] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const guard = await verifyUserRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    await connectDB();
    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: "Notification ID required" },
        { status: 400 }
      );
    }

    const updated = await notificationService.markAsRead(
      notificationId,
      guard.user._id
    );
    return NextResponse.json(
      { success: true, notification: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [PATCH /api/v1/notifications] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
