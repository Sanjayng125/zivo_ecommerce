import z from "zod";

export const getProductReviewsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(10),
    sort: z.enum(["newest", "oldest", "rating_desc", "rating_asc"]).optional().default("newest"),
})

export const createProductReviewSchema = z.object({
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().optional().default(""),
})
