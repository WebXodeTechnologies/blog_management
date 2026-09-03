import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs/blog.model";
import { Category } from "@/modules/categories/category.model";

export async function GET(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    await connectDB();

    const distribution = await Blog.aggregate([
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
        },
      },
    ]);

    await Category.populate(distribution, { path: "_id", select: "name slug" });

    const totalBlogs =
      distribution.reduce((acc, curr) => acc + curr.count, 0) || 1;

    const colors = [
      "bg-indigo-600 text-indigo-600",
      "bg-emerald-600 text-emerald-600",
      "bg-purple-600 text-purple-600",
      "bg-amber-500 text-amber-600",
      "bg-rose-500 text-rose-600",
    ];

    const topics = distribution.map((item, index) => {
      const [color, textColor] = colors[index % colors.length].split(" ");
      return {
        name: item._id?.name || "Uncategorized",
        count: item.count,
        percentage: Math.round((item.count / totalBlogs) * 100),
        color,
        textColor,
      };
    });

    return NextResponse.json({ success: true, topics }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
