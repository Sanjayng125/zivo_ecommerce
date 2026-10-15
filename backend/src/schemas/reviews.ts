import z from "zod";

export const reviewIdSchema = z.object({
    review_id: z.uuid({
        error: "Invalid review ID"
    }),
})

export const getProductReviewsSchema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(30).optional().default(10),
    sort: z.enum(["newest", "oldest", "rating_desc", "rating_asc"]).optional(),
})

export const createProductReviewSchema = z.object({
    rating: z.coerce.number().min(1).max(5),
    title: z.string({ error: "Invalid title" }).min(1, { error: "Title is required" }),
    comment: z.string().optional().default(""),
})

export const updateProductReviewSchema = createProductReviewSchema.partial()
