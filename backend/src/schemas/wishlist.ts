import z from "zod";

export const getWishlistSchema = z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
})

export const wishlistItemIdSchema = z.object({
    item_id: z.uuid({
        error: "Invalid wishlist item ID"
    }),
})
