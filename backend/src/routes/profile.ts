import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getProfile, getRecentlyViewedProducts, updateAvatar, updateProfile } from "../controllers/profile.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { protectedRateLimit } from "../middleware/rate-limit.js";
import { avatarUpdateSchema, profileUpdateSchema } from "../schemas/profile.js";

const app = new Hono()

app.use("*", requireAuth, protectedRateLimit)

app.get("/", getProfile)
app.patch("/", zValidator("json", profileUpdateSchema, customValidationHandler), updateProfile)
app.patch("/avatar", zValidator("json", avatarUpdateSchema, customValidationHandler), updateAvatar)
app.get("/recently-viewed", getRecentlyViewedProducts)

export default app
