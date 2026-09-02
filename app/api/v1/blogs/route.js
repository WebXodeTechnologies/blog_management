import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { BlogService, createBlogSchema } from "@/modules/blogs";
import { Tenant } from "@/modules/tenants";
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

    // Query specifically by tenantId ObjectId reference
    const query = tenantId ? { tenantId } : {};
    const blogs = await blogService.getTenantBlogs(tenantId, query);

    return NextResponse.json({ success: true, blogs }, { status: 200 });
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
