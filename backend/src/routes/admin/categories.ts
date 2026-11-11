import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { createCategory, deleteCategory, getCategories, toggleIsActive, updateCategory, updateCategoryImage } from "../../controllers/admin/categories.js"
import { customValidationHandler } from "../../lib/validator.js"
import { categoryIdSchema, createCategorySchema, getAdminCategoriesSchema, updateCategoryImageSchema, updateCategorySchema } from "../../schemas/categories.js"

const app = new Hono()

app.get("/", zValidator("query", getAdminCategoriesSchema, customValidationHandler), getCategories)
app.post("/", zValidator("json", createCategorySchema, customValidationHandler), createCategory)
app.patch("/:category_id/toggle-is-active",
    zValidator("param", categoryIdSchema, customValidationHandler),
    toggleIsActive
)
app.patch("/:category_id",
    zValidator("param", categoryIdSchema, customValidationHandler),
    zValidator("json", updateCategorySchema, customValidationHandler),
    updateCategory
)
app.patch("/:category_id/image",
    zValidator("param", categoryIdSchema, customValidationHandler),
    zValidator("json", updateCategoryImageSchema, customValidationHandler),
    updateCategoryImage
)
app.delete("/:category_id", zValidator("param", categoryIdSchema, customValidationHandler), deleteCategory)

export default app
