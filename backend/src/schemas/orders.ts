import z from "zod"

export const getOrdersSchema = z.object({
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
            ["newest", "oldest", "total_asc", "total_desc"],
            { error: "Invalid sort option" }
        )
        .default("newest"),
})

export const getOrderSchema = z.object({
    id: z.uuid({ error: "Invalid order ID" })
})

export const getAdminOrdersSchema = getOrdersSchema.extend({
    status: z.enum(["placed", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
    payment_status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    user_id: z.uuid({ error: "Invalid user ID" }).optional(),
})

export const updateOrderStatusSchema = z.object({
    status: z.enum(["placed", "confirmed", "shipped", "delivered", "cancelled"]),
})
