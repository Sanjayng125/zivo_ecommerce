import z from "zod";

export const createBannerSchema = z.object({
    link: z.string().optional(),
    sort_order: z.number().optional().default(0),
    is_active: z.boolean().optional().default(true),
    group_name: z.string().min(3).max(100).optional().default("main"),
});

export const updateBannerSchema = createBannerSchema
    .omit({ is_active: true }).partial()

export const updateBannerImageSchema = z.object({
    image_url: z.url({ error: "Invalid image URL" }),
    image_file_id: z.string({ error: "Invalid image file ID" }),
});


export type CreateBannerValues = z.infer<typeof createBannerSchema>;
export type UpdateBannerValues = z.infer<typeof updateBannerSchema>;
export type UpdateBannerImageValues = z.infer<typeof updateBannerImageSchema>;
