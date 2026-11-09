import z from "zod";

export const creatSchema = z.object({
    title: z.string().min(3, "Min 3 characters").max(200, "Max 200 characters"),
    description: z.string().min(10, "Min 10 characters").max(2000, "Max 2000 characters"),
    base_price: z.number({ error: "Invalid base price" }).min(0, "Cannot be negative") as z.ZodType<number>,
    category_id: z.string().min(1, "Select a category"),
    is_active: z.boolean().default(true),
});

export const updateSchema = creatSchema.extend({
    cover_image: z.url({ error: "Invalid cover image URL" }),
    cover_image_file_id: z.string({ error: "Invalid cover image file id" }),
})

export const variantSchema = z.object({
    sku: z.string().min(3, "Min 3 chars").max(100, "Max 100 chars"),
    size: z.string().optional(),
    color: z.string().optional(),
    price: z.number({ error: "Required" }).min(0, "Cannot be negative") as z.ZodType<number>,
    stock: z.number({ error: "Required" }).min(0, "Cannot be negative") as z.ZodType<number>,
});

export const variantUpdateSchema = variantSchema.omit({
    sku: true,
    stock: true
})
