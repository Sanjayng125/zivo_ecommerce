import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createBanner, deleteBanner, getBanners, toggleIsActive, updateBanner } from "../controllers/banners.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { createBannerSchema, getBannersSchema, updateBannerSchema } from "../schemas/banners.js";

const app = new Hono()

app.get("/", requireAuth, requireAdmin, zValidator("query", getBannersSchema, customValidationHandler), getBanners)
app.post("/", requireAuth, requireAdmin, zValidator("json", createBannerSchema, customValidationHandler), createBanner)
app.patch("/:id/toggle-is-active", requireAuth, requireAdmin, toggleIsActive)
app.patch("/:id", requireAuth, requireAdmin, zValidator("json", updateBannerSchema, customValidationHandler), updateBanner)
app.delete("/:id", requireAuth, requireAdmin, deleteBanner)

export default app
