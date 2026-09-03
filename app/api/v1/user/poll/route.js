import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { Poll } from "@/modules/polls/poll.model";

export async function GET() {
  try {
    await connectDB();

    // Find active poll from MongoDB
    let poll = await Poll.findOne({ active: true });

    // If no poll exists in the DB yet, create a default live document
    if (!poll) {
      poll = await Poll.create({
        question: "What technical topic should Texora highlight next week?",
        active: true,
        options: [
          {
            id: 1,
            label: "Next.js App Router & Server Components",
            votes: 420,
          },
          { id: 2, label: "Rust & Distributed Systems", votes: 280 },
          { id: 3, label: "Web3 Smart Contracts & Security", votes: 142 },
        ],
      });
    }

    return NextResponse.json({ success: true, poll }, { status: 200 });
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
    const { optionId } = await req.json();

    if (!optionId) {
      return NextResponse.json(
        { success: false, message: "Option ID is required" },
        { status: 400 }
      );
    }

    // Actively increment the vote count for the selected option in MongoDB
    const updatedPoll = await Poll.findOneAndUpdate(
      { active: true, "options.id": Number(optionId) },
      { $inc: { "options.$.votes": 1 } },
      { new: true }
    );

    if (!updatedPoll) {
      return NextResponse.json(
        { success: false, message: "Poll option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Vote registered successfully",
        poll: updatedPoll,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
