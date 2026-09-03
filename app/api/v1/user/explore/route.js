import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/users/user.model";
import { Blog } from "@/modules/blogs/blog.model";
import { Highlight } from "@/modules/highlights/highlight.model";
import { History } from "@/modules/history/history.model";
import { Comment } from "@/modules/comments/comment.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("Explore API Error: No token found in cookies.");
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
    console.log("Explore API Auth Success - User ID:", userId);

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "your-list";
    console.log("Explore API Active Tab Requested:", tab);

    let data = [];

    if (tab === "your-list") {
      data = await Blog.find({ authorId: userId })
        .populate("authorId", "name avatar")
        .sort({ createdAt: -1 })
        .select(
          "title slug excerpt category image coverImage readTime createdAt views likes status"
        );
    } else if (tab === "saved") {
      const user = await User.findById(userId).populate({
        path: "savedBlogs",
        populate: { path: "authorId", select: "name avatar" },
        select:
          "title slug excerpt category image coverImage readTime createdAt views likes",
      });
      data = user?.savedBlogs || [];
      console.log("Fetched Saved Blogs Count:", data.length);
    } else if (tab === "highlights") {
      data = await Highlight.find({
        $or: [{ userId: userId }, { authorId: userId }],
      })
        .populate("blogId", "title slug coverImage image category")
        .sort({ createdAt: -1 });
    } else if (tab === "history") {
      data = await History.find({
        $or: [{ userId: userId }, { authorId: userId }],
      })
        .populate("blogId", "title slug readTime image coverImage category authorId")
        .sort({ updatedAt: -1 })
        .limit(20);
    } else if (tab === "reposts") {
      const user = await User.findById(userId).populate({
        path: "repostedBlogs",
        populate: { path: "authorId", select: "name avatar" },
      });
      data = user?.repostedBlogs || [];
      if (!data.length) {
        data = await Blog.find({ repostsList: userId })
          .populate("authorId", "name avatar")
          .sort({ createdAt: -1 });
      }
      console.log("Fetched Reposted Blogs Count:", data.length);
    } else if (tab === "responses") {
      data = await Comment.find({ userId: userId })
        .populate("userId", "name avatar")
        .populate("blogId", "title slug coverImage image category")
        .sort({ createdAt: -1 });
      console.log("Fetched Responses/Comments Count:", data.length);
    }

    console.log(
      `Explore API Query Result for [${tab}]:`,
      data.length,
      "items found"
    );
    return NextResponse.json({ success: true, items: data }, { status: 200 });
  } catch (error) {
    console.error("Explore API Server Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
