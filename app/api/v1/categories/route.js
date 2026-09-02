import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { CategoryService, createCategorySchema } from "@/modules/categories";
import { Tenant } from "@/modules/tenants";
import { verifyTenantPermission } from "@/modules/rbac";
import { PERMISSIONS } from "@/modules/rbac";

const categoryService = new CategoryService();

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tenantSlug =
      req.headers.get("x-tenant-slug") || searchParams.get("tenantSlug");

    let tenantId = null;
    if (tenantSlug) {
      const tenant = await Tenant.findOne({ slug: tenantSlug });
      if (tenant) tenantId = tenant._id;
    }

    const categories = await categoryService.getTenantCategories(tenantId);
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
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

    // Only Admin can manage categories
    const authResult = await verifyTenantPermission(
      req,
      tenant._id,
      PERMISSIONS.MANAGE_CATEGORIES || "admin"
    );
    if (!authResult.authorized) {
      return authResult.response;
    }

    const validatedData = createCategorySchema.parse(body);
    const category = await categoryService.createCategory(
      tenant._id,
      validatedData
    );

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
