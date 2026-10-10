import z from "zod";

export const createProductSchema = z.object({
    title: z.string({ error: "Invalid title" }).min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
    description: z.string({ error: "Invalid description" }).min(10, "Description must be at least 3 characters").max(2000, "Description must be at most 2000 characters"),
    base_price: z.coerce.number({ error: "Invalid base price" }).min(0, "Base price cannot be negative"),
    cover_image: z.url({ error: "Invalid cover image URL" }),
    category_id: z.uuid({ error: "Invalid category ID" }),
    is_active: z.boolean().optional().default(true),
})

export const updateProductSchema = createProductSchema
    .omit({ is_active: true })
    .partial()

export const getProductsSchema = z.object({
    category_id: z
        .uuid({ error: "Invalid category ID" })
        .optional(),
    min_price: z
        .coerce
        .number({ error: "Minimum price must be a number" })
        .min(0, "Minimum price cannot be negative")
        .optional(),
    max_price: z
        .coerce
        .number({ error: "Maximum price must be a number" })
        .min(0, "Maximum price cannot be negative")
        .optional(),
    page: z
        .coerce
        .number({ error: "Page must be a number" })
        .int("Page must be a whole number")
        .min(1, "Page must be at least 1")
        .default(1),
    limit: z
        .coerce
        .number({ error: "Limit must be a number" })
        .int("Limit must be a whole number")
        .min(1, "Limit must be at least 1")
        .max(100, "Limit cannot exceed 100")
        .default(20),
    sort: z
        .enum(
            ["newest", "oldest", "price_asc", "price_desc", "rating"],
            { error: "Invalid sort option" }
        )
        .default("newest"),
    is_active: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    q: z.string().trim().min(2, "Search query must be at least 2 characters").max(200, "Search query must be at most 200 characters").optional(),
})
