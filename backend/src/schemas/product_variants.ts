import z from "zod";

export const productVariantsSchema = z.object({
    product_id: z.uuid({ error: "Invalid product ID" }),
})

export const createProductVariantSchema = z.object({
    sku: z.string({ error: "Invalid SKU" }).min(3, "SKU must be at least 3 characters").max(100, "SKU must be at most 100 characters"),
    size: z.string({ error: "Invalid Size" }).optional(),
    color: z.string({ error: "Invalid Color" }).optional(),
    price: z.coerce.number({ error: "Invalid price" }).min(0),
    stock: z.coerce.number({ error: "Invalid stock" }).min(0),
})

export const updateProductVariantSchema = createProductVariantSchema
    .omit({ sku: true, stock: true })
    .partial()

export const updateStockSchema = z.object({
    stock: z.coerce.number({ error: "Invalid stock" }).min(0),
})

