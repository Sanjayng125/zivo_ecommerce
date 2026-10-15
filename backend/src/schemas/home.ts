import z from "zod";

export const homeSectionIdSchema = z.object({
    home_section_id: z.uuid({
        error: "Invalid home section ID"
    }),
})

export const bannerConfigSchema = z.object({
    group_name: z.string({ error: "Invalid group name" }).min(3, "Group name must be at least 3 characters").max(255, "Group name must be at most 255 characters"),
})

export const categoryRowConfigSchema = z.object({
    limit: z.coerce.number().min(1).max(30).default(10),
    parent_id: z.uuid({ error: "Invalid parent category ID" }).optional(),
    display: z.object({
        show_title: z.boolean().optional().default(true),
        show_view_all: z.boolean().optional().default(true),
        view_all_link: z.string().optional(),
    })
})

export const productRowConfigSchema = z.object({
    limit: z.coerce.number().min(1).max(30).default(10),
    sort: z.enum(["new_arrivals", "best_sellers", "top_rated", "trending"]).default("new_arrivals"),
    category_id: z.uuid({ error: "Invalid category ID" }).optional(),
    card_size: z.enum(["small", "medium", "large"]).optional().default("medium"),
    display: z.object({
        show_title: z.boolean().optional().default(true),
        show_view_all: z.boolean().optional().default(true),
        view_all_link: z.string().optional(),
    })
})

export const createHomeSectionSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("banner"),
        title: z.string().min(3).max(100),
        key: z.string().min(3).max(100),
        sort_order: z.coerce.number().optional().default(0),
        config: bannerConfigSchema,
    }),
    z.object({
        type: z.literal("category_row"),
        title: z.string().min(3).max(100),
        key: z.string().min(3).max(100),
        sort_order: z.coerce.number().optional().default(0),
        config: categoryRowConfigSchema,
    }),
    z.object({
        type: z.literal("product_row"),
        title: z.string().min(3).max(100),
        key: z.string().min(3).max(100),
        sort_order: z.coerce.number().optional().default(0),
        config: productRowConfigSchema,
    }),
], { error: "Invalid home section" })

export const updateHomeSectionSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("banner"),
        title: z.string().optional(),
        key: z.string().min(3).max(100).optional(),
        sort_order: z.coerce.number().optional(),
        config: bannerConfigSchema.partial().optional(),
    }),
    z.object({
        type: z.literal("category_row"),
        title: z.string().optional(),
        key: z.string().min(3).max(100).optional(),
        sort_order: z.coerce.number().optional(),
        config: categoryRowConfigSchema.partial().optional(),
    }),
    z.object({
        type: z.literal("product_row"),
        title: z.string().optional(),
        key: z.string().min(3).max(100).optional(),
        sort_order: z.coerce.number().optional(),
        config: productRowConfigSchema.partial().optional(),
    }),
], { error: "Invalid home section" })

export const getHomeSectionsSchema = z.object({
    is_active: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    sort: z.enum(["newest", "oldest", "sort_order_asc", "sort_order_desc"]).optional().default("newest"),
})
