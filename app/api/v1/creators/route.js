import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { User } from "@/modules/auth/user.model";
import { Blog } from "@/modules/blogs/blog.model";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get("tenantSlug") || "general";

    // Find users who have published blogs, or fallback to returning top registered users
    const users = await User.find({ role: { $ne: "admin" } })
      .select("name avatar headline role")
      .limit(3);

    const formattedCreators = await Promise.all(
      users.map(async (u) => {
        const articleCount = await Blog.countDocuments({
          authorId: u._id,
          status: "published",
        });
        return {
          id: u._id,
          name: u.name || "Technical Creator",
          role: u.headline || u.role || "Fullstack Architect",
          avatar:
            u.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
          storiesCount: articleCount,
        };
      })
    );

    return NextResponse.json(
      { success: true, creators: formattedCreators },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
