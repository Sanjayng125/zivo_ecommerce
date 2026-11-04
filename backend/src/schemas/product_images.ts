import z from "zod";

export const productImageIdSchema = z.object({
    product_image_id: z.uuid({
        error: "Invalid product image ID"
    }),
})

export const createProductImageSchema = z.object({
    url: z.url({ error: "Invalid URL" }),
    file_id: z.string({ error: "Invalid file id" }),
    sort_order: z.coerce.number().optional().default(0),
})

export const updateProductImageSchema = createProductImageSchema
    .partial()
    .superRefine((data, ctx) => {
        const hasImage = data.url !== undefined
        const hasImageFileId = data.file_id !== undefined

        if (hasImage !== hasImageFileId) {
            ctx.addIssue({
                code: "custom",
                message: "Image URL and its file ID must be provided together",
                path: ["url"]
            })
        }
    })

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
