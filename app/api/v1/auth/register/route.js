import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/auth/user.model";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role to ensure only allowed values are accepted
    const assignedRole = ["user", "moderator"].includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
