import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProductReview, deleteProductReview, getProductReviews, updateProductReview } from "../controllers/reviews.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { createProductReviewSchema, getProductReviewsSchema } from "../schemas/reviews.js";

const app = new Hono()

app.get("/:product_id", zValidator("query", getProductReviewsSchema, customValidationHandler), getProductReviews)
app.post("/:product_id", requireAuth, zValidator("json", createProductReviewSchema, customValidationHandler), createProductReview)
app.delete("/:id", requireAuth, deleteProductReview)
app.patch("/:id", requireAuth, zValidator("json", createProductReviewSchema, customValidationHandler), updateProductReview)

export default app
