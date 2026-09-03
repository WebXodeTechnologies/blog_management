import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { Blog } from "@/modules/blogs/blog.model";
import { User } from "@/modules/users/user.model";
import { Tenant } from "@/modules/tenants/tenant.model";
import { Category } from "@/modules/categories/category.model";
import { AuditLog } from "@/modules/audit-logs/audit-log.model";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const defaultPassword = await bcrypt.hash("TexoraUser@2026", 10);

    // 1. Seed or find a default Admin User first to satisfy Tenant's ownerId requirement
    let adminUser = await User.findOne({ email: "alex.rivera@texora.io" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Alex Rivera",
        email: "alex.rivera@texora.io",
        password: defaultPassword,
        role: "moderator",
        seniorityLevel: "founder",
        yearsOfExperience: 8,
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      });
    }

    // 2. Seed or find default Tenant using the adminUser._id as ownerId
    let tenant = await Tenant.findOne({ slug: "tech-pulse" });
    if (!tenant) {
      tenant = await Tenant.create({
        name: "Tech Pulse Workspace",
        slug: "tech-pulse",
        status: "active",
        ownerId: adminUser._id,
      });
    }

    // 3. Seed or find default Category
    let category = await Category.findOne({ name: "Architecture" });
    if (!category) {
      category = await Category.create({
        name: "Architecture",
        slug: "architecture",
        description: "Systems & Cloud Architecture",
        tenantId: tenant._id,
      });
    }

    // 4. Seed real Users with Seniority Level ranks
    const sampleAuthors = [
      {
        name: "Alex Rivera",
        email: "alex.rivera@texora.io",
        seniorityLevel: "founder",
        yearsOfExperience: 8,
        role: "moderator",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      },
      {
        name: "Elena Rostova",
        email: "elena.rostova@texora.io",
        seniorityLevel: "senior_developer",
        yearsOfExperience: 6,
        role: "moderator",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
      },
      {
        name: "Marcus Vance",
        email: "marcus.vance@texora.io",
        seniorityLevel: "tech_enthusiast",
        yearsOfExperience: 3,
        role: "user",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      },
    ];

    const createdUsers = [];
    for (const a of sampleAuthors) {
      let u = await User.findOne({ email: a.email });
      if (!u) {
        u = await User.create({
          name: a.name,
          email: a.email,
          password: defaultPassword,
          role: a.role,
          seniorityLevel: a.seniorityLevel,
          yearsOfExperience: a.yearsOfExperience,
          avatar: a.avatar,
          tenantId: tenant._id,
        });
      } else {
        u.seniorityLevel = a.seniorityLevel;
        u.yearsOfExperience = a.yearsOfExperience;
        await u.save();
      }
      createdUsers.push(u);
    }

    // 5. Seed real pending blogs into MongoDB
    const sampleBlogs = [
      {
        title: "Building Distributed Event Loops in Rust & Node.js",
        slug: "building-distributed-event-loops-in-rust-nodejs",
        content:
          "An architectural deep-dive into thread pools, lock-free queues, and asynchronous event loops for high-throughput microservices. In this guide we explore runtime latency and memory safety benchmarks.",
        excerpt:
          "An architectural deep-dive into thread pools, lock-free queues, and asynchronous event loops for high-throughput microservices...",
        authorId: createdUsers[0]._id,
        categoryId: category._id,
        tenantId: tenant._id,
        status: "pending",
      },
      {
        title: "Zero-Trust Security Patterns in Enterprise Next.js App Router",
        slug: "zero-trust-security-patterns-in-enterprise-nextjs-app-router",
        content:
          "Enforcing strict authorization policies, RBAC middleware, and CSP headers in modern multi-tenant App Router setups. Learn how to secure JWT session cookies and eliminate privilege escalation risks.",
        excerpt:
          "Enforcing strict authorization policies, RBAC middleware, and CSP headers in modern multi-tenant App Router setups...",
        authorId: createdUsers[1]._id,
        categoryId: category._id,
        tenantId: tenant._id,
        status: "pending",
      },
      {
        title: "Automated Crypto Airdrop Bot & Flash Loan Script Analysis",
        slug: "automated-crypto-airdrop-bot-flash-loan-script-analysis",
        content:
          "Understanding automated arbitrage transactions using flash loan smart contracts across decentralized exchanges. We audit gas optimization and execution risk patterns.",
        excerpt:
          "Understanding automated arbitrage transactions using flash loan smart contracts across decentralized exchanges...",
        authorId: createdUsers[2]._id,
        categoryId: category._id,
        tenantId: tenant._id,
        status: "pending",
      },
    ];

    const createdBlogs = [];
    for (const b of sampleBlogs) {
      let blog = await Blog.findOne({
        slug: b.slug,
        tenantId: tenant._id,
      });

      if (!blog) {
        blog = await Blog.create(b);
      } else {
        blog.status = "pending";
        await blog.save();
      }
      createdBlogs.push(blog);
    }

    // 6. Seed initial audit log documents
    let auditLog = await AuditLog.findOne({ action: "AUTO_FLAGGED" });
    if (!auditLog && createdUsers[0] && createdBlogs[2]) {
      await AuditLog.create({
        actorId: createdUsers[0]._id,
        action: "AUTO_FLAGGED",
        entityType: "Blog",
        entityId: createdBlogs[2]._id,
        details: {
          title: createdBlogs[2].title,
          reason: "High risk keyword pattern detected",
          newStatus: "pending",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Successfully seeded real moderation pending blogs & authors in MongoDB!",
        seededUsers: createdUsers.length,
        seededBlogs: createdBlogs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [GET /api/v1/moderation/seed] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
