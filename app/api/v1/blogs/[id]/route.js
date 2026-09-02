import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import {
  BlogService,
  updateBlogSchema,
  authorizeBlogModification,
} from "@/modules/blogs";
import { Tenant } from "@/modules/tenants";
import mongoose from "mongoose";

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

    if (
      !blog ||
      (tenantId && blog.tenantId.toString() !== tenantId.toString())
    ) {
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
    const tenantSlug = req.headers.get("x-tenant-slug") || body.tenantSlug;

    if (!tenantSlug) {
      return NextResponse.json(
        { success: false, message: "Tenant context is required" },
        { status: 400 }
      );
    }

    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Tenant workspace not found" },
        { status: 404 }
      );
    }

    const authResult = await authorizeBlogModification(req, tenant._id);
    if (!authResult.authorized) {
      return authResult.response;
    }

    // Verify blog exists and belongs to this tenant
    const existingBlog = await blogService.blogRepository.findById(id);
    if (
      !existingBlog ||
      existingBlog.tenantId.toString() !== tenant._id.toString()
    ) {
      return NextResponse.json(
        { success: false, message: "Blog not found in this workspace" },
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
    const { searchParams } = new URL(req.url);
    const tenantSlug =
      req.headers.get("x-tenant-slug") || searchParams.get("tenantSlug");

    if (!tenantSlug) {
      return NextResponse.json(
        { success: false, message: "Tenant context is required" },
        { status: 400 }
      );
    }

    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Tenant workspace not found" },
        { status: 404 }
      );
    }

    const authResult = await authorizeBlogModification(req, tenant._id);
    if (!authResult.authorized) {
      return authResult.response;
    }

    // Verify blog exists and belongs to this tenant before deletion
    const existingBlog = await blogService.blogRepository.findById(id);
    if (
      !existingBlog ||
      existingBlog.tenantId.toString() !== tenant._id.toString()
    ) {
      return NextResponse.json(
        { success: false, message: "Blog not found in this workspace" },
        { status: 404 }
      );
    }

    await blogService.deleteBlog(id);

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
