import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env file");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "moderator", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    const emailsToSeed = [
      "contact.webxodetechnolgies@gmail.com",
      "contact.webxodetechnologies@gmail.com",
    ];
    const plainPassword = "Texoradmin@2026@$#";
    const adminName = "Texoradmin";

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    for (const email of emailsToSeed) {
      let existingUser = await User.findOne({ email });

      if (existingUser) {
        existingUser.name = adminName;
        existingUser.password = hashedPassword;
        existingUser.role = "admin";
        await existingUser.save();
        console.log(`✅ Admin account updated for: ${email}`);
      } else {
        const newAdmin = new User({
          name: adminName,
          email: email,
          password: hashedPassword,
          role: "admin",
        });
        await newAdmin.save();
        console.log(`✅ Admin account created for: ${email}`);
      }
    }

    console.log("\n-------------------------------------------");
    console.log("🔑 ADMIN CREDENTIALS REGISTERED IN MONGODB:");
    console.log(`📧 Emails:   contact.webxodetechnologies@gmail.com`);
    console.log(`             contact.webxodetechnolgies@gmail.com`);
    console.log(`👤 Name:     Texoradmin`);
    console.log(`🔒 Password: ${plainPassword}`);
    console.log(`🛡️ Role:     admin`);
    console.log("-------------------------------------------\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
