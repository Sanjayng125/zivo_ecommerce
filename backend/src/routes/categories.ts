import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCategories, getCategory } from "../controllers/categories.js";
import { customValidationHandler } from "../lib/validator.js";
import { getCategoriesSchema } from "../schemas/categories.js";

const app = new Hono()

app.get("/", zValidator("query", getCategoriesSchema, customValidationHandler), getCategories)
app.get("/:slug", getCategory)

export default app
