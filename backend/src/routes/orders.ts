import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getAdminOrder, getAdminOrders, getOrder, getOrders, updateOrderStatus } from "../controllers/orders.js"
import { customValidationHandler } from "../lib/validator.js"
import { requireAdmin, requireAuth } from "../middleware/auth.js"
import { getAdminOrdersSchema, getOrderSchema, getOrdersSchema, updateOrderStatusSchema } from "../schemas/orders.js"

const app = new Hono()

app.get("/admin", requireAuth, requireAdmin, zValidator("query", getAdminOrdersSchema, customValidationHandler), getAdminOrders)
app.patch("/admin/:id", requireAuth, requireAdmin, zValidator("json", updateOrderStatusSchema, customValidationHandler), updateOrderStatus)
app.get("/admin/:id", requireAuth, requireAdmin, zValidator("param", getOrderSchema, customValidationHandler), getAdminOrder)

app.get("/", requireAuth, zValidator("query", getOrdersSchema, customValidationHandler), getOrders)
app.get("/:id", requireAuth, zValidator("param", getOrderSchema, customValidationHandler), getOrder)

export default app
