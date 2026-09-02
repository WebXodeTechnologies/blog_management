import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "moderator", "admin"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});
