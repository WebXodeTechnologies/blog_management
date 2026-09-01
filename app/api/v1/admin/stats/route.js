import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import { User } from "@/modules/auth/user.model";
import { Tenant } from "@/modules/tenants/tenant.model";
import { Blog } from "@/modules/blogs/blog.model";
import { Category } from "@/modules/categories/category.model";

export async function GET(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const [totalUsers, totalTenants, totalBlogs, totalCategories, recentUsers] =
      await Promise.all([
        User.countDocuments(),
        Tenant.countDocuments(),
        Blog.countDocuments(),
        Category.countDocuments(),
        User.find().select("name email role createdAt avatar").sort({ createdAt: -1 }).limit(5),
      ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    return NextResponse.json(
      {
        stats: {
          totalUsers,
          totalTenants,
          totalBlogs,
          totalCategories,
        },
        usersByRole,
        recentUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch platform statistics" },
      { status: 500 }
    );
  }
}
