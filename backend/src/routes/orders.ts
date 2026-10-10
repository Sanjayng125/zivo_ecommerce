import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getOrder, getOrders } from "../controllers/orders.js"
import { customValidationHandler } from "../lib/validator.js"
import { requireAuth } from "../middleware/auth.js"
import { getOrderSchema, getOrdersSchema } from "../schemas/orders.js"

const app = new Hono()

app.get("/", requireAuth, zValidator("query", getOrdersSchema, customValidationHandler), getOrders)
app.get("/:id", requireAuth, zValidator("param", getOrderSchema, customValidationHandler), getOrder)

export default app
