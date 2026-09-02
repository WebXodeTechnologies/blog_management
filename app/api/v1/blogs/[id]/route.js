import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { BlogService, updateBlogSchema } from "@/modules/blogs";
import { Tenant } from "@/modules/tenants";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/modules/auth/user.model";

const blogService = new BlogService();

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantSlug =
      req.headers.get("x-tenant-slug") || searchParams.get("tenantSlug");

    let tenantId = null;
    if (tenantSlug) {
      const tenant = await Tenant.findOne({ slug: tenantSlug });
      if (tenant) tenantId = tenant._id;
    }

    let blog;
    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await blogService.blogRepository.findById(id);
    } else {
      blog = tenantId ? await blogService.getBlogBySlug(id, tenantId) : null;
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // 1. Authenticate user via JWT Cookie
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

    // 2. Verify blog exists
    const existingBlog = await blogService.blogRepository.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    // 3. Safely extract author ID whether populated as an object or stored as reference string
    const blogAuthorId = existingBlog.authorId?._id
      ? existingBlog.authorId._id.toString()
      : existingBlog.authorId?.toString();

    const isAuthor =
      blogAuthorId && blogAuthorId === currentUser._id.toString();
    const isPrivileged =
      currentUser.role === "admin" || currentUser.role === "moderator";

    if (!isAuthor && !isPrivileged) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You cannot modify this story" },
        { status: 403 }
      );
    }

    let tenantSlug = req.headers.get("x-tenant-slug") || body.tenantSlug;
    let tenant = null;

    if (tenantSlug) {
      tenant = await Tenant.findOne({ slug: tenantSlug });
    }
    if (!tenant && existingBlog.tenantId) {
      tenant = await Tenant.findById(existingBlog.tenantId);
    }

    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Tenant workspace not found" },
        { status: 404 }
      );
    }

    const validatedData = updateBlogSchema.parse(body);
    const updatedBlog = await blogService.updateBlog(
      id,
      tenant._id,
      validatedData
    );

    return NextResponse.json(
      { success: true, blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [PUT /api/v1/blogs/[id]] Exception:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

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

    const existingBlog = await blogService.blogRepository.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    const blogAuthorId = existingBlog.authorId?._id
      ? existingBlog.authorId._id.toString()
      : existingBlog.authorId?.toString();

    const isAuthor =
      blogAuthorId && blogAuthorId === currentUser._id.toString();
    const isPrivileged =
      currentUser.role === "admin" || currentUser.role === "moderator";

    if (!isAuthor && !isPrivileged) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You cannot delete this story" },
        { status: 403 }
      );
    }

    await blogService.deleteBlog(id);

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [DELETE /api/v1/blogs/[id]] Exception:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
