import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/users/user.model";
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

    const user = await User.findById(userId).populate({
      path: "following",
      select: "name email avatar headline bio role location createdAt",
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const followingList = user.following || [];
    const followingIds = followingList.map((f) => f._id);

    // Compute live article count for each followed author
    const followingWithStats = await Promise.all(
      followingList.map(async (author) => {
        const count = await Blog.countDocuments({
          authorId: author._id,
          status: "published",
        });
        const authorObj = author.toObject();
        authorObj.articlesCount = count;
        authorObj.isFollowing = true;
        return authorObj;
      })
    );

    // Fetch suggested authors (excluding logged-in user and already followed authors)
    const suggestedUsers = await User.find({
      _id: { $ne: userId, $nin: followingIds },
    })
      .select("name email avatar headline bio role location createdAt")
      .limit(6);

    const suggestedWithStats = await Promise.all(
      suggestedUsers.map(async (author) => {
        const count = await Blog.countDocuments({
          authorId: author._id,
          status: "published",
        });
        const authorObj = author.toObject();
        authorObj.articlesCount = count;
        authorObj.isFollowing = false;
        return authorObj;
      })
    );

    // Aggregate active categories from published blogs
    const categoryAgg = await Blog.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    const categories = categoryAgg.map((c) => ({
      name: c._id || "Architecture",
      count: c.count,
    }));

    return NextResponse.json(
      {
        success: true,
        following: followingWithStats,
        suggested: suggestedWithStats,
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Following API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
