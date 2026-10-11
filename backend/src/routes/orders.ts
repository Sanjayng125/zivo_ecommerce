import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getOrder, getOrders } from "../controllers/orders.js"
import { customValidationHandler } from "../lib/validator.js"
import { requireAuth } from "../middleware/auth.js"
import { getOrdersSchema, orderIdSchema } from "../schemas/orders.js"

const app = new Hono()

app.get("/", requireAuth, zValidator("query", getOrdersSchema, customValidationHandler), getOrders)
app.get("/:order_id", requireAuth, zValidator("param", orderIdSchema, customValidationHandler), getOrder)

export default app
