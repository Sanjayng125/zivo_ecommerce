import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { searchProducts } from "../controllers/search.js";
import { customValidationHandler } from "../lib/validator.js";
import { publicRateLimit } from "../middleware/rate-limit.js";
import { searchProductsSchema } from "../schemas/products.js";

const app = new Hono()

app.use("*", publicRateLimit)

app.get("/", zValidator("query", searchProductsSchema, customValidationHandler), searchProducts)

export default app
