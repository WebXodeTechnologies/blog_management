import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters long"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color")
    .optional(),
  icon: z.string().optional(),
  isGlobal: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
