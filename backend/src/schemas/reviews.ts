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
    title: z.string({ error: "Invalid title" }).trim()
        .min(1, { error: "Title is required" }),
    comment: z.string()
        .max(500, "Comment must be at most 500 characters").trim()
        .refine(val => (val.match(/\n/g) ?? []).length <= 2, "Too many line breaks").optional(),
})

export const updateProductReviewSchema = createProductReviewSchema.partial()
