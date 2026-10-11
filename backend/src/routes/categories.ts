import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCategories, getCategory } from "../controllers/categories.js";
import { customValidationHandler } from "../lib/validator.js";
import { categoryIdSchema, getCategoriesSchema } from "../schemas/categories.js";

const app = new Hono()

app.get("/", zValidator("query", getCategoriesSchema, customValidationHandler), getCategories)
app.get("/:category_id", zValidator("param", categoryIdSchema, customValidationHandler), getCategory)

export default app
