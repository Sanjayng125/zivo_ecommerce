import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getHomeSections, toggleIsActive, updateHomeSection } from "../../controllers/admin/home.js"
import { customValidationHandler } from "../../lib/validator.js"
import { getHomeSectionsSchema, updateHomeSectionSchema } from "../../schemas/home.js"

const app = new Hono()

app.get("/", zValidator("query", getHomeSectionsSchema, customValidationHandler), getHomeSections)
app.patch("/:id/toggle-is-active", toggleIsActive)
app.patch("/:id", zValidator("json", updateHomeSectionSchema, customValidationHandler), updateHomeSection)

export default app
