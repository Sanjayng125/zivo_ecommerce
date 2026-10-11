import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addProductView, getProduct } from "../controllers/products.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { publicRateLimit } from "../middleware/rate-limit.js";
import { productIdSchema, productSlugSchema } from "../schemas/products.js";

const app = new Hono()

app.use("*", publicRateLimit)

app.get("/:slug", zValidator("param", productSlugSchema, customValidationHandler), getProduct);
app.post("/views/:product_id", requireAuth, zValidator("param", productIdSchema, customValidationHandler), addProductView)

export default app
