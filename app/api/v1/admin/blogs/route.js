import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import { Blog } from "@/modules/blogs/blog.model";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";

export async function GET(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (status && ["draft", "published", "archived", "rejected"].includes(status)) {
      query.status = status;
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("authorId", "name email avatar")
      .populate("categoryId", "name slug color")
      .populate("tenantId", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        blogs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch platform blogs" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const { blogId, status } = await req.json();

    if (!blogId || !["draft", "published", "archived", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid blogId or status provided" },
        { status: 400 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { status },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    await AuditLog.create({
      actorId: guard.user._id,
      action: "BLOG_STATUS_UPDATED",
      entityType: "Blog",
      entityId: blogId,
      details: { newStatus: status, title: updatedBlog.title },
    });

    return NextResponse.json({ blog: updatedBlog }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog status" },
      { status: 500 }
    );
  }
}
