import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/auth/user.model";
import { Blog } from "@/modules/blogs/blog.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );

    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const totalStories = await Blog.countDocuments({ authorId: user._id });
    const publishedStories = await Blog.countDocuments({
      authorId: user._id,
      status: "published",
    });
    const draftStories = await Blog.countDocuments({
      authorId: user._id,
      status: "draft",
    });

    const blogs = await Blog.find({ authorId: user._id }).select(
      "views likes commentsCount"
    );

    const rawViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);
    const rawClaps = blogs.reduce((acc, b) => acc + (b.likes || 0), 0);

    const presentationsCount = user.presentationsCount || 0;
    const followersCount = user.followersCount || 0;
    const pollVotesCount = user.pollVotesCount || 0;

    const enrichedUser = {
      ...user.toObject(),
      stats: {
        totalStories,
        publishedStories,
        draftStories,
        totalViews:
          rawViews > 1000 ? `${(rawViews / 1000).toFixed(1)}k` : rawViews,
        totalReads: `${Math.round(rawViews * 0.68)}`,
        followers: followersCount.toLocaleString(),
        fanPolls: pollVotesCount,
        presentations: presentationsCount,
        totalClaps: rawClaps,
      },
    };

    return NextResponse.json({ user: enrichedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
