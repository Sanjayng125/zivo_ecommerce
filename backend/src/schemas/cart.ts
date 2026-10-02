import z from "zod";

export const addCartItemSchema = z.object({
    variant_id: z.uuid({ error: "Invalid product ID" }),
    quantity: z.coerce.number().default(1),
})

export const updateCartItemSchema = z.object({
    item_id: z.uuid({ error: "Invalid cart item ID" }),
    quantity: z.coerce.number(),
})
