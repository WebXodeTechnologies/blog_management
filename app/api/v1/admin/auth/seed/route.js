import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/db";
import { User } from "@/modules/auth/user.model";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const emailsToSeed = [
      "contact.webxodetechnolgies@gmail.com",
      "contact.webxodetechnologies@gmail.com",
    ];
    const plainPassword = "Texoradmin@2026@$#";
    const adminName = "Texoradmin";

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    for (const email of emailsToSeed) {
      let user = await User.findOne({ email });

      if (user) {
        user.name = adminName;
        user.password = hashedPassword;
        user.role = "admin";
        await user.save();
      } else {
        await User.create({
          name: adminName,
          email,
          password: hashedPassword,
          role: "admin",
        });
      }
    }

    return NextResponse.json(
      {
        message: "Admin credentials updated in MongoDB",
        emails: emailsToSeed,
        password: plainPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to seed admin user" },
      { status: 500 }
    );
  }
}
