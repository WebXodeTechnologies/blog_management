import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import { Tenant } from "@/modules/tenants/tenant.model";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";
import slugify from "slugify";

export async function GET(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const tenants = await Tenant.find()
      .populate("ownerId", "name email avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json({ tenants }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const { name, domain, plan } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Tenant name is required" },
        { status: 400 }
      );
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Tenant.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Tenant slug/name already exists" },
        { status: 400 }
      );
    }

    const tenant = await Tenant.create({
      name,
      slug,
      domain: domain || "",
      ownerId: guard.user._id,
      plan: plan || "free",
      status: "active",
    });

    await AuditLog.create({
      actorId: guard.user._id,
      action: "TENANT_CREATED",
      entityType: "Tenant",
      entityId: tenant._id,
      details: { tenantName: name, slug, plan },
    });

    return NextResponse.json({ tenant }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const { tenantId, status, plan } = await req.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (plan) updateFields.plan = plan;

    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      updateFields,
      { new: true }
    );

    if (!updatedTenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    await AuditLog.create({
      actorId: guard.user._id,
      action: "TENANT_UPDATED",
      entityType: "Tenant",
      entityId: tenantId,
      details: updateFields,
    });

    return NextResponse.json({ tenant: updatedTenant }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}
