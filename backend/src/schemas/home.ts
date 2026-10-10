import z from "zod";

export const getHomeSectionsSchema = z.object({
    is_active: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    sort: z.enum(["newest", "oldest", "sort_order_asc", "sort_order_desc"]).optional().default("newest"),
})

export const updateHomeSectionSchema = z.object({
    title: z.string({ error: "Invalid title" }).min(3, "Title must be at least 3 characters").max(20, "Title must be at most 20 characters").optional(),
    sort_order: z.coerce.number().optional().default(0),
})
