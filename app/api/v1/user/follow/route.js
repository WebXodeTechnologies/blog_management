import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/users/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );
    const userId = decoded.id || decoded.userId;

    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: "Target user ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.following = user.following || [];
    const isFollowing = user.following.some(
      (id) => id.toString() === targetUserId.toString()
    );

    if (isFollowing) {
      user.following = user.following.filter(
        (id) => id.toString() !== targetUserId.toString()
      );
    } else {
      user.following.push(targetUserId);
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        isFollowing: !isFollowing,
        message: !isFollowing ? "Author followed" : "Author unfollowed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST Follow API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
