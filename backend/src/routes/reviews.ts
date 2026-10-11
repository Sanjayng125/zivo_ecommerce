import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProductReview, deleteProductReview, getProductReviews, updateProductReview } from "../controllers/reviews.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { protectedRateLimit, publicRateLimit } from "../middleware/rate-limit.js";
import { productIdSchema } from "../schemas/products.js";
import { createProductReviewSchema, getProductReviewsSchema, reviewIdSchema } from "../schemas/reviews.js";

const app = new Hono()

app.get("/:product_id",
    publicRateLimit,
    zValidator("param", productIdSchema, customValidationHandler),
    zValidator("query", getProductReviewsSchema, customValidationHandler),
    getProductReviews
)
app.post("/:product_id",
    requireAuth,
    protectedRateLimit,
    zValidator("param", productIdSchema, customValidationHandler),
    zValidator("json", createProductReviewSchema, customValidationHandler),
    createProductReview
)
app.delete("/:review_id",
    requireAuth,
    protectedRateLimit,
    zValidator("param", reviewIdSchema, customValidationHandler),
    deleteProductReview
)
app.patch("/:review_id",
    requireAuth,
    protectedRateLimit,
    zValidator("param", reviewIdSchema, customValidationHandler),
    zValidator("json", createProductReviewSchema, customValidationHandler),
    updateProductReview
)

export default app
