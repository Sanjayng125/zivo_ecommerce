import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCategories, getCategory } from "../controllers/categories.js";
import { customValidationHandler } from "../lib/validator.js";
import { publicRateLimit } from "../middleware/rate-limit.js";
import { categorySlugSchema, getCategoriesSchema } from "../schemas/categories.js";

const app = new Hono()

app.use("*", publicRateLimit)

app.get("/", zValidator("query", getCategoriesSchema, customValidationHandler), getCategories)
app.get("/:slug", zValidator("param", categorySlugSchema, customValidationHandler), getCategory)

export default app
