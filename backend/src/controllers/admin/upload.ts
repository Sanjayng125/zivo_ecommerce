import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { customValidationHandler } from "../../lib/validator.js"
import { bannerIdSchema } from "../../schemas/banners.js"
import { categoryIdSchema } from "../../schemas/categories.js"
import { homeSectionIdSchema } from "../../schemas/home.js"
import { productIdSchema } from "../../schemas/products.js"
import { generateUploadAuth } from "../../services/imagekit.js"

export const getImageUploadAuth = async (c: Context) => {
    const { fileName, type } = await c.req.json()
    const entity_id = c.req.param("entity_id")

    let folder = ""

    switch (type) {
        case "cover_image":
        case "product_image": {
            const result = productIdSchema.safeParse({ product_id: entity_id })
            if (!result.success) customValidationHandler(result)
            folder = `products/${type === "cover_image" ? "cover_images" : "product_images"}/${result.data?.product_id}`
            break
        }
        case "category_image": {
            const result = categoryIdSchema.safeParse({ category_id: entity_id })
            if (!result.success) customValidationHandler(result)
            folder = `categories/images/${result.data?.category_id}`
            break
        }
        case "banner_image": {
            const result = bannerIdSchema.safeParse({ banner_id: entity_id })
            if (!result.success) customValidationHandler(result)
            folder = `banners/images/${result.data?.banner_id}`
            break
        }
        case "home_section_image": {
            const result = homeSectionIdSchema.safeParse({ home_section_id: entity_id })
            if (!result.success) customValidationHandler(result)
            folder = `home_sections/images/${result.data?.home_section_id}`
            break
        }
        default:
            throw new HTTPException(400, { message: "Invalid image type" })
    }

    const authParams = generateUploadAuth(folder, fileName)

    return c.json({
        ...authParams
    })
}
