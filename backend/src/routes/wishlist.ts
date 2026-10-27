import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../controllers/wishlist.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { protectedRateLimit } from "../middleware/rate-limit.js";
import { productIdSchema } from "../schemas/products.js";
import { getWishlistSchema, wishlistItemIdSchema } from "../schemas/wishlist.js";

const app = new Hono()

app.use("*", requireAuth, protectedRateLimit)

app.get("/", zValidator("query", getWishlistSchema, customValidationHandler), getWishlist)
app.post("/", zValidator("json", productIdSchema, customValidationHandler), addWishlistItem)
app.delete("/:item_id", zValidator("param", wishlistItemIdSchema, customValidationHandler), removeWishlistItem)

export default app
