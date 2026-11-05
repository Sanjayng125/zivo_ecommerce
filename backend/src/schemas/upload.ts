import z from "zod";

export const getImageUploadAuthSchema = z.object({
    type: z.enum(
        ["cover_image", "product_image", "category_image", "banner_image", "home_section_image"],
        { error: "Invalid image type" }
    ),
    fileName: z.string({ error: "Invalid filename" })
        .trim()
        .min(1, "Filename is required")
        .max(255, "Filename is too long")
})
