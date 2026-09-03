import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs/blog.model";
import { User } from "@/modules/users/user.model";
import { Comment } from "@/modules/comments/comment.model";
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
    const { blogId, action, commentText, commentId } = body;
    if (!blogId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (action === "like") {
      blog.likesList = blog.likesList || [];
      const hasLiked = blog.likesList.some(
        (id) => id.toString() === userId.toString()
      );

      if (hasLiked) {
        blog.likesList = blog.likesList.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        blog.likesList.push(userId);
      }
      blog.likes = blog.likesList.length;
      await blog.save();
    } else if (action === "bookmark") {
      user.savedBlogs = user.savedBlogs || [];
      const isSaved = user.savedBlogs.some(
        (id) => id.toString() === blogId.toString()
      );

      if (isSaved) {
        user.savedBlogs = user.savedBlogs.filter(
          (id) => id.toString() !== blogId.toString()
        );
      } else {
        user.savedBlogs.push(blogId);
      }
      await user.save();
    } else if (action === "repost") {
      blog.repostsList = blog.repostsList || [];
      user.repostedBlogs = user.repostedBlogs || [];

      const hasReposted = blog.repostsList.some(
        (id) => id.toString() === userId.toString()
      );

      if (hasReposted) {
        blog.repostsList = blog.repostsList.filter(
          (id) => id.toString() !== userId.toString()
        );
        user.repostedBlogs = user.repostedBlogs.filter(
          (id) => id.toString() !== blogId.toString()
        );
      } else {
        blog.repostsList.push(userId);
        user.repostedBlogs.push(blogId);
      }
      blog.reposts = blog.repostsList.length;
      await blog.save();
      await user.save();
    } else if (action === "comment") {
      if (!commentText || !commentText.trim()) {
        return NextResponse.json(
          { success: false, message: "Comment cannot be empty" },
          { status: 400 }
        );
      }

      await Comment.create({
        userId,
        blogId,
        comment: commentText.trim(),
      });

      const totalComments = await Comment.countDocuments({ blogId });
      blog.commentsCount = totalComments;
      await blog.save();
    } else if (action === "edit-comment") {
      if (!commentText || !commentText.trim()) {
        return NextResponse.json(
          { success: false, message: "Comment cannot be empty" },
          { status: 400 }
        );
      }

      await Comment.findOneAndUpdate(
        { _id: commentId, userId },
        { comment: commentText.trim() },
        { new: true }
      );
    } else if (action === "delete-comment") {
      await Comment.findOneAndDelete({ _id: commentId, userId });

      const totalComments = await Comment.countDocuments({ blogId });
      blog.commentsCount = totalComments;
      await blog.save();
    }

    // Retrieve updated blog with author details
    const updatedBlog = await Blog.findById(blogId).populate(
      "authorId",
      "name avatar"
    );

    // Retrieve updated comments from Comment collection
    const comments = await Comment.find({ blogId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    const blogObj = updatedBlog.toObject();
    blogObj.comments = comments;
    blogObj.commentsCount = comments.length;
    blogObj.currentUserId = userId;

    const isLiked =
      blogObj.likesList?.some((id) => id.toString() === userId.toString()) ||
      false;
    const isReposted =
      blogObj.repostsList?.some((id) => id.toString() === userId.toString()) ||
      false;

    const currentUserDoc = await User.findById(userId);
    const isBookmarked =
      currentUserDoc?.savedBlogs?.some(
        (id) => id.toString() === blogId.toString()
      ) || false;

    blogObj.isLiked = isLiked;
    blogObj.isBookmarked = isBookmarked;
    blogObj.isReposted = isReposted;
    blogObj.likes = blogObj.likesList ? blogObj.likesList.length : 0;
    blogObj.reposts = blogObj.repostsList ? blogObj.repostsList.length : 0;

    return NextResponse.json(
      {
        success: true,
        blog: blogObj,
        isLiked,
        isBookmarked,
        isReposted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [API interact] Error caught:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
