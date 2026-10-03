import z from "zod"

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
})
