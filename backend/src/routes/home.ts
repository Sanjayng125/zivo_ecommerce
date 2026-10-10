import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getAdminHomeSections, getHomeSections, toggleIsActive, updateHomeSection } from "../controllers/home.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { getHomeSectionsSchema, updateHomeSectionSchema } from "../schemas/home.js";

const app = new Hono()

app.get("/", getHomeSections)
app.get("/admin", requireAuth, requireAdmin, zValidator("query", getHomeSectionsSchema, customValidationHandler), getAdminHomeSections)
app.patch("/:id/toggle-is-active", requireAuth, requireAdmin, toggleIsActive)
app.patch("/:id", requireAuth, requireAdmin, zValidator("json", updateHomeSectionSchema, customValidationHandler), updateHomeSection)

export default app
