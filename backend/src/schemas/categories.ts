import z from "zod";

export const getCategoriesSchema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(0).optional().default(10),
    sort: z.enum(["newest", "oldest", "sort_order_asc", "sort_order_desc"]).optional().default("newest"),
    q: z.string().trim().optional().default(""),
})

export const getAdminCategoriesSchema = getCategoriesSchema.extend({
    is_active: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
})

export const createCategorySchema = z.object({
    name: z.string({ error: "Invalid name" }).min(3, "Name must be at least 3 characters").max(200, "Name must be at most 200 characters"),
    parent_id: z.uuid({ error: "Invalid parent category ID" }).optional(),
    image_url: z.url({ error: "Invalid image URL" }).optional(),
    sort_order: z.coerce.number().optional().default(0),
    is_active: z.boolean().optional().default(true),
})

export const updateCategorySchema = createCategorySchema
    .omit({ is_active: true })
    .partial()
