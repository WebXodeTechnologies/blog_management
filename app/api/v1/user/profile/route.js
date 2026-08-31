import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/auth/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PUT(req) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );

    const body = await req.json();
    const { name, avatar, phone, bio, headline, pronouns, location, socialLinks } = body;

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (headline !== undefined) user.headline = headline;
    if (pronouns !== undefined) user.pronouns = pronouns;
    if (location !== undefined) user.location = location;

    if (socialLinks) {
      user.socialLinks = {
        twitter: socialLinks.twitter ?? user.socialLinks?.twitter ?? "",
        github: socialLinks.github ?? user.socialLinks?.github ?? "",
        linkedin: socialLinks.linkedin ?? user.socialLinks?.linkedin ?? "",
        website: socialLinks.website ?? user.socialLinks?.website ?? "",
        instagram: socialLinks.instagram ?? user.socialLinks?.instagram ?? "",
      };
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
