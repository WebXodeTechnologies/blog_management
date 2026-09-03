import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { BlogService, createBlogSchema } from "@/modules/blogs";
import { Tenant } from "@/modules/tenants";
import { Comment } from "@/modules/comments/comment.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/modules/auth/user.model";

const blogService = new BlogService();

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tenantSlug =
      req.headers.get("x-tenant-slug") ||
      searchParams.get("tenantSlug") ||
      "general";

    let tenantId = null;
    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (tenant) {
      tenantId = tenant._id;
    }

    const query = tenantId ? { tenantId } : {};
    const blogs = await blogService.getTenantBlogs(tenantId, query);

    // Extract current user if authenticated
    let currentUserId = null;
    let currentUserDoc = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "fallback_secret_key"
        );
        currentUserId = decoded.id || decoded.userId;
        if (currentUserId) {
          currentUserDoc = await User.findById(currentUserId).select(
            "savedBlogs repostedBlogs"
          );
        }
      }
    } catch {}

    // Fetch and attach comments, likes, bookmarks, and repost status for each blog
    const blogsWithInteractions = await Promise.all(
      blogs.map(async (blog) => {
        const blogObj = blog.toObject ? blog.toObject() : blog;

        // Query the standalone Comment collection linked to this blog ID
        const comments = await Comment.find({ blogId: blogObj._id })
          .populate("userId", "name avatar")
          .sort({ createdAt: -1 });

        const isLiked = currentUserId
          ? (blogObj.likesList || []).some(
              (id) => id.toString() === currentUserId.toString()
            )
          : false;

        const isBookmarked = currentUserDoc?.savedBlogs
          ? currentUserDoc.savedBlogs.some(
              (id) => id.toString() === blogObj._id.toString()
            )
          : false;

        const isReposted = currentUserId
          ? (blogObj.repostsList || []).some(
              (id) => id.toString() === currentUserId.toString()
            )
          : false;

        return {
          ...blogObj,
          comments,
          likes: blogObj.likesList
            ? blogObj.likesList.length
            : blogObj.likes || 0,
          commentsCount: comments.length,
          reposts: blogObj.repostsList
            ? blogObj.repostsList.length
            : blogObj.reposts || 0,
          isLiked,
          isBookmarked,
          isReposted,
          currentUserId,
        };
      })
    );

    return NextResponse.json(
      { success: true, blogs: blogsWithInteractions },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/v1/blogs] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const tenantSlug =
      req.headers.get("x-tenant-slug") || body.tenantSlug || "general";

    if (!tenantSlug) {
      return NextResponse.json(
        { success: false, message: "Tenant context is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );
    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    let tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      tenant = await Tenant.create({
        name: tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1),
        slug: tenantSlug,
        status: "active",
        ownerId: currentUser._id,
      });
    }

    const validatedData = createBlogSchema.parse(body);
    const blog = await blogService.createBlog(
      currentUser._id,
      tenant._id,
      validatedData
    );

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    console.error("🔥 [POST /api/v1/blogs] Unhandled Exception:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
