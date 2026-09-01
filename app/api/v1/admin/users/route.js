import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import { User } from "@/modules/auth/user.model";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";

export async function GET(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["user", "moderator", "admin"].includes(role)) {
      query.role = role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const { userId, role } = await req.json();

    if (!userId || !["user", "moderator", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid userId or role provided" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Log action to AuditLog
    await AuditLog.create({
      actorId: guard.user._id,
      action: "USER_ROLE_UPDATED",
      entityType: "User",
      entityId: userId,
      details: { newRole: role, updatedUserEmail: updatedUser.email },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
