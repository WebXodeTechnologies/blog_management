import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/auth/user.model";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, avatar } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required from Google profile" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");

      user = await User.create({
        name: name || "Developer",
        email,
        password: randomPassword,
        role: "user",
        avatar: avatar || "",
        googleAvatar: avatar || "",
      });
    } else if (avatar && !user.googleAvatar) {
      user.googleAvatar = avatar;
      if (!user.avatar) user.avatar = avatar;
      await user.save();
    }

    // Generate JWT token (matches your app's auth standard)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    );

    // Set HTTP-only session cookie for Next.js (Next.js 15/16 async cookies)
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Google authentication successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google Auth API Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error during Google auth" },
      { status: 500 }
    );
  }
}
