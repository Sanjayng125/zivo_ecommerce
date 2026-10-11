import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addCartItem, clearCart, getCart, removeCartItem, updateQuantity } from "../controllers/cart.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { protectedRateLimit } from "../middleware/rate-limit.js";
import { addCartItemSchema, cartItemIdSchema, updateCartItemSchema } from "../schemas/cart.js";

const app = new Hono()

app.use("*", requireAuth, protectedRateLimit)

app.get("/", getCart)
app.post("/", zValidator("json", addCartItemSchema, customValidationHandler), addCartItem)
app.patch("/:item_id",
    zValidator("param", cartItemIdSchema, customValidationHandler),
    zValidator("json", updateCartItemSchema, customValidationHandler),
    updateQuantity)
app.delete("/", clearCart)
app.delete("/:item_id", zValidator("param", cartItemIdSchema, customValidationHandler), removeCartItem)

export default app
