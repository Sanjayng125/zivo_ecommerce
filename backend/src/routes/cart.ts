import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addCartItem, clearCart, getCart, removeCartItem, updateQuantity } from "../controllers/cart.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { addCartItemSchema, cartItemIdSchema, updateCartItemSchema } from "../schemas/cart.js";

const app = new Hono()

app.get("/", requireAuth, getCart)
app.post("/", requireAuth, zValidator("json", addCartItemSchema, customValidationHandler), addCartItem)
app.patch("/:item_id",
    requireAuth,
    zValidator("param", cartItemIdSchema, customValidationHandler),
    zValidator("json", updateCartItemSchema, customValidationHandler),
    updateQuantity)
app.delete("/", requireAuth, clearCart)
app.delete("/:item_id", requireAuth, zValidator("param", cartItemIdSchema, customValidationHandler), removeCartItem)

export default app
