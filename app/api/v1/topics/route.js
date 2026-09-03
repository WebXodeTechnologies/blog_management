import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs/blog.model";

const TOPIC_NAMES = [
  "System Architecture",
  "AI & Data Pipelines",
  "Web Development",
  "Startups & Scaling",
  "Founder's Notes",
  "Career & Learning",
];

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get("tenantSlug") || "general";

    const counts = await Promise.all(
      TOPIC_NAMES.map(async (name) => {
        // Strict query filtering by tenant if applicable, or just category and status
        const query = {
          category: { $regex: new RegExp(`^${name}$`, "i") },
          status: "published",
        };

        // If your schema uses tenantSlug, include it here:
        // if (tenantSlug && tenantSlug !== "general") query.tenantSlug = tenantSlug;

        const count = await Blog.countDocuments(query);
        console.log(`[TOPICS API] Category: "${name}" -> Count: ${count}`);
        return { name, count };
      })
    );

    return NextResponse.json(
      { success: true, topics: counts },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TOPICS API ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
