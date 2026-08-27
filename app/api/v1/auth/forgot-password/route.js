import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/auth/user.model";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email/mailer";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Security check: Don't leak whether an email exists or not in response
    if (user) {
      // Generate secure random token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Hash token and set expiration (1 hour from now)
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

      await user.save();

      // Send the email with the unhashed token
      await sendPasswordResetEmail(user.email, resetToken);
    }

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
