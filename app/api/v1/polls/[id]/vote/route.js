import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/db";
import { Poll } from "@/modules/polls/poll.model";
import { verifyUserRequest } from "@/modules/rbac/rbac.guard";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const guard = await verifyUserRequest(req);
    if (!guard.authorized) return guard.response;

    const { id } = await params;
    const { optionId } = await req.json();
    const userId = guard.user._id.toString();

    const poll = await Poll.findById(id);
    if (!poll || !poll.active) {
      return NextResponse.json(
        { success: false, error: "Poll not found or inactive" },
        { status: 404 }
      );
    }

    if (poll.votedUsers.includes(userId)) {
      return NextResponse.json(
        { success: false, error: "You have already voted in this poll" },
        { status: 400 }
      );
    }

    const option = poll.options.find((opt) => opt.id === Number(optionId));
    if (!option) {
      return NextResponse.json(
        { success: false, error: "Invalid poll option" },
        { status: 400 }
      );
    }

    option.votes += 1;
    poll.votedUsers.push(userId);
    await poll.save();

    return NextResponse.json({ success: true, poll }, { status: 200 });
  } catch (error) {
    console.error("🔥 [POST /api/v1/polls/vote] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
