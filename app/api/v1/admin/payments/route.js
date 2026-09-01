import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/modules/rbac/rbac.guard";
import { Tenant } from "@/modules/tenants/tenant.model";

export async function GET(req) {
  const guard = await verifyAdminRequest(req);
  if (!guard.authorized) return guard.response;

  try {
    const tenants = await Tenant.find().populate("ownerId", "name email");

    const planCounts = {
      free: 0,
      pro: 0,
      enterprise: 0,
    };

    tenants.forEach((t) => {
      const p = (t.plan || "free").toLowerCase();
      if (planCounts[p] !== undefined) {
        planCounts[p]++;
      } else {
        planCounts.free++;
      }
    });

    // Calculate MRR: Pro = $49/mo, Enterprise = $199/mo
    const mrr = planCounts.pro * 49 + planCounts.enterprise * 199;
    const arr = mrr * 12;

    // Generate mock transaction stream matching Razorpay format for preview
    const recentTransactions = [
      {
        id: "pay_N83xK129d",
        tenant: tenants[0]?.name || "Acme Engineering",
        amount: "$49.00",
        plan: "PRO",
        status: "captured",
        method: "Razorpay (Card)",
        date: new Date().toLocaleDateString(),
      },
      {
        id: "pay_M92yJ881a",
        tenant: tenants[1]?.name || "DevPulse Labs",
        amount: "$199.00",
        plan: "ENTERPRISE",
        status: "captured",
        method: "Razorpay (UPI)",
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
      },
      {
        id: "pay_K71zA554c",
        tenant: tenants[2]?.name || "CloudNative Tech",
        amount: "$49.00",
        plan: "PRO",
        status: "captured",
        method: "Razorpay (NetBanking)",
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
      },
    ];

    return NextResponse.json(
      {
        mrr: `$${mrr.toLocaleString()}`,
        arr: `$${arr.toLocaleString()}`,
        planCounts,
        recentTransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payment analytics" },
      { status: 500 }
    );
  }
}
