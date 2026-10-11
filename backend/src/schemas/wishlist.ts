import z from "zod";

export const wishlistItemIdSchema = z.object({
    item_id: z.uuid({
        error: "Invalid wishlist item ID"
    }),
})
