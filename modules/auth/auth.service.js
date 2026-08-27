import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.model";
import { connectDB } from "@/lib/db"; // Assuming a shared DB connection helper

export async function registerUser({ name, email, password, role }) {
  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password using bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function loginUser({ email, password }) {
  await connectDB();

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
