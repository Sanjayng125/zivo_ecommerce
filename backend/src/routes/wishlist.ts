import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../controllers/wishlist.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";

const app = new Hono()

const addWishlistItemSchema = z.object({
    product_id: z.uuid({ error: "Invalid product ID" })
})

app.get("/", requireAuth, getWishlist)
app.post("/", requireAuth, zValidator("json", addWishlistItemSchema, customValidationHandler), addWishlistItem)
app.delete("/:id", requireAuth, removeWishlistItem)

export default app
