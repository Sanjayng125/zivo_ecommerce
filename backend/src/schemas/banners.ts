import z from "zod";

export const getBannersSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(0).default(10),
    sort: z.enum(["newest", "oldest", "sort_order_asc", "sort_order_desc"]).optional().default("newest"),
    is_active: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
})

export const createBannerSchema = z.object({
    image_url: z.url({ error: "Invalid image URL" }),
    link: z.url({ error: "Invalid link URL" }).optional(),
    sort_order: z.coerce.number().optional().default(0),
    is_active: z.boolean().optional().default(true),
})

export const updateBannerSchema = createBannerSchema
    .omit({ is_active: true })
    .partial()
