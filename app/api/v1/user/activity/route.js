import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs/blog.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
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

    // Fetch real posts categorized by status
    const recentPosts = await Blog.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const drafts = recentPosts.filter((b) => b.status === "draft");
    const scheduled = recentPosts.filter((b) => b.status === "scheduled");

    // Aggregate weekly view stats or fallback to defaults
    const blogs = await Blog.find({ authorId: userId }).select(
      "views likes createdAt"
    );
    const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);

    return NextResponse.json(
      {
        success: true,
        drafts: recentPosts, // or drafts array
        scheduled,
        stats: {
          totalViews,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
