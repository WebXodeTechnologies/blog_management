import { verifyTenantPermission } from "@/modules/rbac";
import { PERMISSIONS } from "@/modules/rbac";

export async function authorizeBlogCreation(req, tenantId) {
  return await verifyTenantPermission(req, tenantId, PERMISSIONS.BLOG_CREATE);
}

export async function authorizeBlogModification(req, tenantId) {
  return await verifyTenantPermission(req, tenantId, PERMISSIONS.BLOG_EDIT);
}

export async function authorizeBlogPublishing(req, tenantId) {
  return await verifyTenantPermission(req, tenantId, PERMISSIONS.BLOG_PUBLISH);
}

export async function authorizeBlogApproval(req, tenantId) {
  return await verifyTenantPermission(req, tenantId, PERMISSIONS.BLOG_APPROVE);
}
