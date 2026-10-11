import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getOrder, getOrders, updateOrderStatus } from "../../controllers/admin/orders.js"
import { customValidationHandler } from "../../lib/validator.js"
import { getAdminOrdersSchema, orderIdSchema, updateOrderStatusSchema } from "../../schemas/orders.js"

const app = new Hono()

app.get("/", zValidator("query", getAdminOrdersSchema, customValidationHandler), getOrders)
app.patch("/:order_id",
    zValidator("param", orderIdSchema, customValidationHandler),
    zValidator("json", updateOrderStatusSchema, customValidationHandler),
    updateOrderStatus
)
app.get("/:order_id", zValidator("param", orderIdSchema, customValidationHandler), getOrder)

export default app
