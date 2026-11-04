import z from "zod";

export const bannerIdSchema = z.object({
    banner_id: z.uuid({
        error: "Invalid banner ID"
    }),
})

export const getBannersSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(30).default(10),
    sort: z.enum(["newest", "oldest", "sort_order_asc", "sort_order_desc"]).optional().default("newest"),
    is_active: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
})

export const createBannerSchema = z.object({
    link: z.url({ error: "Invalid link URL" }).optional(),
    sort_order: z.coerce.number().optional().default(0),
    is_active: z.boolean().optional().default(true),
    group_name: z.string().min(3).max(100).optional().default("main"),
})

export const updateBannerSchema = createBannerSchema
    .omit({ is_active: true })
    .extend({
        image_url: z.url({ error: "Invalid image URL" }),
        image_file_id: z.string({ error: "Invalid image file id" }),
    })
    .partial()
    .superRefine((data, ctx) => {
        const hasImage = data.image_url !== undefined
        const hasImageFileId = data.image_file_id !== undefined

        if (hasImage !== hasImageFileId) {
            ctx.addIssue({
                code: "custom",
                message: "Image URL and image file ID must be provided together",
                path: ["image_url"]
            })
        }
    })
