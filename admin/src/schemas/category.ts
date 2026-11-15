// src/schemas/category.ts
import { z } from "zod/v4";

export const createCategorySchema = z.object({
    name: z.string().min(3, "Min 3 characters").max(200, "Max 200 characters"),
    parent_id: z.string().optional(),
    sort_order: z.number().optional().default(0),
    is_active: z.boolean().optional().default(true),
});

export const updateCategorySchema = z.object({
    name: z.string().min(3).max(200).optional(),
    parent_id: z.string().optional(),
    sort_order: z.number().optional(),
});

export const updateCategoryImageSchema = z.object({
    image_url: z.url({ error: "Invalid image URL" }),
    image_file_id: z.string({ error: "Invalid image file ID" }),
});

export type CreateCategoryValues = z.infer<typeof createCategorySchema>;
export type UpdateCategoryValues = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryImageValues = z.infer<typeof updateCategoryImageSchema>;
