import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getOrder, getOrders, updateOrderStatus } from "../../controllers/admin/orders.js"
import { customValidationHandler } from "../../lib/validator.js"
import { getAdminOrdersSchema, getOrderSchema, updateOrderStatusSchema } from "../../schemas/orders.js"

const app = new Hono()

app.get("/", zValidator("query", getAdminOrdersSchema, customValidationHandler), getOrders)
app.patch("/:id", zValidator("json", updateOrderStatusSchema, customValidationHandler), updateOrderStatus)
app.get("/:id", zValidator("param", getOrderSchema, customValidationHandler), getOrder)

export default app
