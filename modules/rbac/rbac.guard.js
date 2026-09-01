import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/auth/user.model";
import { ROLES } from "./rbac.constants";

export async function verifyAdminRequest(req) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token =
      cookieStore.get("adminToken")?.value || cookieStore.get("token")?.value;

    if (!token) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Unauthorized: Admin session token required" },
          { status: 401 }
        ),
      };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return {
        authorized: false,
        response: NextResponse.json({ error: "User not found" }, { status: 404 }),
      };
    }

    if (user.role !== ROLES.ADMIN) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Forbidden: Admin access required" },
          { status: 403 }
        ),
      };
    }

    return { authorized: true, user };
  } catch (error) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Invalid token or server error" },
        { status: 401 }
      ),
    };
  }
}
