import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createBanner, deleteBanner, getBanners, toggleIsActive, updateBanner } from "../../controllers/admin/banners.js";
import { customValidationHandler } from "../../lib/validator.js";
import { createBannerSchema, getBannersSchema, updateBannerSchema } from "../../schemas/banners.js";

const app = new Hono()

app.get("/", zValidator("query", getBannersSchema, customValidationHandler), getBanners)
app.post("/", zValidator("json", createBannerSchema, customValidationHandler), createBanner)
app.patch("/:id/toggle-is-active", toggleIsActive)
app.patch("/:id", zValidator("json", updateBannerSchema, customValidationHandler), updateBanner)
app.delete("/:id", deleteBanner)

export default app
