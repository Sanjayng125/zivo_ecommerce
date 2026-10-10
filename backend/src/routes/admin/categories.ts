import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { createCategory, deleteCategory, getCategories, toggleIsActive, updateCategory } from "../../controllers/admin/categories.js"
import { customValidationHandler } from "../../lib/validator.js"
import { createCategorySchema, getAdminCategoriesSchema, updateCategorySchema } from "../../schemas/categories.js"

const app = new Hono()

app.get("/", zValidator("query", getAdminCategoriesSchema, customValidationHandler), getCategories)
app.post("/", zValidator("json", createCategorySchema, customValidationHandler), createCategory)
app.patch("/:id/toggle-is-active", toggleIsActive)
app.patch("/:id", zValidator("json", updateCategorySchema, customValidationHandler), updateCategory)
app.delete("/:id", deleteCategory)

export default app
