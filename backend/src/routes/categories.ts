import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createCategory, deleteCategory, getAdminCategories, getCategories, getCategory, toggleIsActive, updateCategory } from "../controllers/categories.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { createCategorySchema, getAdminCategoriesSchema, getCategoriesSchema, updateCategorySchema } from "../schemas/categories.js";

const app = new Hono()

// admin
app.get("/admin", requireAuth, requireAdmin, zValidator("query", getAdminCategoriesSchema, customValidationHandler), getAdminCategories)
app.post("/", requireAuth, requireAdmin, zValidator("json", createCategorySchema, customValidationHandler), createCategory)
app.patch("/:id/toggle-is-active", requireAuth, requireAdmin, toggleIsActive)
app.patch("/:id", requireAuth, requireAdmin, zValidator("json", updateCategorySchema, customValidationHandler), updateCategory)
app.delete("/:id", requireAuth, requireAdmin, deleteCategory)

app.get("/", zValidator("query", getCategoriesSchema, customValidationHandler), getCategories)
app.get("/:slug", getCategory)

export default app
