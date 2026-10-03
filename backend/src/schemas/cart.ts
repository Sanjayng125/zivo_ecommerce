import z from "zod"

export const addCartItemSchema = z.object({
    variant_id: z.uuid({
        error: "Invalid product variant ID"
    }),
    quantity: z.coerce
        .number({
            error: "Quantity must be a number"
        })
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1")
        .max(10, "Quantity cannot exceed 10")
        .default(1),
})

export const updateCartItemSchema = z.object({
    item_id: z.uuid({
        error: "Invalid cart item ID"
    }),
    quantity: z.coerce
        .number({
            error: "Quantity must be a number"
        })
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1")
        .max(10, "Quantity cannot exceed 10"),
})
