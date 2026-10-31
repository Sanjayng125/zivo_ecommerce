import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getOrder, getOrders, verifyPayment } from "../controllers/orders.js"
import { customValidationHandler } from "../lib/validator.js"
import { requireAuth } from "../middleware/auth.js"
import { protectedRateLimit } from "../middleware/rate-limit.js"
import { getOrdersSchema, orderIdSchema } from "../schemas/orders.js"

const app = new Hono()

app.use("*", requireAuth, protectedRateLimit)

app.get("/", zValidator("query", getOrdersSchema, customValidationHandler), getOrders)
app.get("/:order_id", zValidator("param", orderIdSchema, customValidationHandler), getOrder)
app.get("/:order_id/verify-payment", zValidator("param", orderIdSchema, customValidationHandler), verifyPayment)

export default app
