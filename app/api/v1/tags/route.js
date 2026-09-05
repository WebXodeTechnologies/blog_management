import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs/blog.model"; // Adjust path as needed

export async function GET() {
  try {
    await connectDB();
    // Extract unique tags from published blogs
    const tags = await Blog.distinct("tags", { status: "published" });
    return NextResponse.json({ success: true, tags }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
