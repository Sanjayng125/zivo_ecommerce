import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addCartItem, clearCart, getCart, removeCartItem, updateQuantity } from "../controllers/cart.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { addCartItemSchema } from "../schemas/cart.js";

const app = new Hono()

app.get("/", requireAuth, getCart)
app.post("/", requireAuth, zValidator("json", addCartItemSchema, customValidationHandler), addCartItem)
app.patch("/:item_id", requireAuth, updateQuantity)
app.delete("/", requireAuth, clearCart)
app.delete("/:item_id", requireAuth, removeCartItem)

export default app
