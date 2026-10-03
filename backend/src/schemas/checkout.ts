import z from "zod";

export const createOrderSchema = z.object({
    address_id: z.uuid({ error: "Invalid address" })
})
