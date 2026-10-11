import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../controllers/wishlist.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { productIdSchema } from "../schemas/products.js";
import { wishlistItemIdSchema } from "../schemas/wishlist.js";

const app = new Hono()

app.get("/", requireAuth, getWishlist)
app.post("/", requireAuth, zValidator("json", productIdSchema, customValidationHandler), addWishlistItem)
app.delete("/:item_id", requireAuth, zValidator("param", wishlistItemIdSchema, customValidationHandler), removeWishlistItem)

export default app
