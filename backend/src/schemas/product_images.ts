import z from "zod";

export const productImageIdSchema = z.object({
    product_image_id: z.uuid({
        error: "Invalid product image ID"
    }),
})

export const createProductImageSchema = z.object({
    url: z.url({ error: "Invalid URL" }),
    sort_order: z.coerce.number().optional().default(0),
})

export const updateProductImageSchema = createProductImageSchema
    .partial()

export const reorderProductImageSchema = z.object({
    new_sort_order: z.array(
        z.object({
            product_image_id: z.uuid({ error: "Invalid product image ID" }),
            sort_order: z.coerce.number(),
        })
    ).min(1),
})

export type ProductImage = {
    product_image_id: string
    sort_order: number
}
