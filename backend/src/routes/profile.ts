import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getProfile, getRecentlyViewedProducts, updateAvatar, updateProfile } from "../controllers/profile.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { avatarUpdateSchema, profileUpdateSchema } from "../schemas/profile.js";

const app = new Hono()

app.get("/", requireAuth, getProfile)
app.patch("/", requireAuth, zValidator("json", profileUpdateSchema, customValidationHandler), updateProfile)
app.patch("/avatar", requireAuth, zValidator("json", avatarUpdateSchema, customValidationHandler), updateAvatar)
app.get("/recently-viewed", requireAuth, getRecentlyViewedProducts)

export default app
