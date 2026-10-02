import z from "zod";

export const getProductsSchema = z.object({
    category_id: z.uuid({ error: "Invalid category ID" }).optional(),
    min_price: z.coerce.number().optional(),
    max_price: z.coerce.number().optional(),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    sort: z.enum(["newest", "oldest", "price_asc", "price_desc", "rating"]).optional().default("newest"),
    q: z.string().min(2)
})


