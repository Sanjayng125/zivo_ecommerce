import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getHomeSections, toggleIsActive, updateHomeSection } from "../../controllers/admin/home.js"
import { customValidationHandler } from "../../lib/validator.js"
import { getHomeSectionsSchema, homeSectionIdSchema, updateHomeSectionSchema } from "../../schemas/home.js"

const app = new Hono()

app.get("/", zValidator("query", getHomeSectionsSchema, customValidationHandler), getHomeSections)
app.patch("/:home_section_id/toggle-is-active",
    zValidator("param", homeSectionIdSchema, customValidationHandler),
    toggleIsActive
)
app.patch("/:home_section_id",
    zValidator("param", homeSectionIdSchema, customValidationHandler),
    zValidator("json", updateHomeSectionSchema, customValidationHandler),
    updateHomeSection
)

export default app
