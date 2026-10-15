import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProductReview, deleteProductReview, getMyProductReview, getProductReviews, updateProductReview } from "../controllers/reviews.js";
import { customValidationHandler } from "../lib/validator.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { protectedRateLimit, publicRateLimit } from "../middleware/rate-limit.js";
import { productIdSchema } from "../schemas/products.js";
import { createProductReviewSchema, getProductReviewsSchema, reviewIdSchema, updateProductReviewSchema } from "../schemas/reviews.js";

const app = new Hono()

app.get("/:product_id/my-review",
    requireAuth,
    publicRateLimit,
    zValidator("param", productIdSchema, customValidationHandler),
    getMyProductReview
)
app.get("/:product_id",
    optionalAuth,
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
    zValidator("json", updateProductReviewSchema, customValidationHandler),
    updateProductReview
)

export default app
