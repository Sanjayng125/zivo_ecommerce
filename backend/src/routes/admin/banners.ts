import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createBanner, deleteBanner, getBanners, toggleIsActive, updateBanner } from "../../controllers/admin/banners.js";
import { customValidationHandler } from "../../lib/validator.js";
import { bannerIdSchema, createBannerSchema, getBannersSchema, updateBannerSchema } from "../../schemas/banners.js";

const app = new Hono()

app.get("/", zValidator("query", getBannersSchema, customValidationHandler), getBanners)
app.post("/", zValidator("json", createBannerSchema, customValidationHandler), createBanner)
app.patch("/:banner_id/toggle-is-active", zValidator("param", bannerIdSchema, customValidationHandler), toggleIsActive)
app.patch("/:banner_id",
    zValidator("param", bannerIdSchema, customValidationHandler),
    zValidator("json", updateBannerSchema, customValidationHandler),
    updateBanner
)
app.delete("/:banner_id", zValidator("param", bannerIdSchema, customValidationHandler), deleteBanner)

export default app
