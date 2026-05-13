import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  isActive: z.boolean()
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;