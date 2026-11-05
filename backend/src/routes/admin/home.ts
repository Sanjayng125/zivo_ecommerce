import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { createHomeSection, deleteHomeSection, getHomeSections, toggleIsActive, updateHomeSection } from "../../controllers/admin/home.js"
import { customValidationHandler } from "../../lib/validator.js"
import { createHomeSectionSchema, getHomeSectionsSchema, homeSectionIdSchema, updateHomeSectionSchema } from "../../schemas/home.js"

const app = new Hono()

app.get("/", zValidator("query", getHomeSectionsSchema, customValidationHandler), getHomeSections)
app.post("/", zValidator("json", createHomeSectionSchema, customValidationHandler), createHomeSection)
app.patch("/:home_section_id/toggle-is-active",
    zValidator("param", homeSectionIdSchema, customValidationHandler),
    toggleIsActive
)
app.patch("/:home_section_id",
    zValidator("param", homeSectionIdSchema, customValidationHandler),
    zValidator("json", updateHomeSectionSchema, customValidationHandler),
    updateHomeSection
)
app.delete("/:home_section_id",
    zValidator("param", homeSectionIdSchema, customValidationHandler),
    deleteHomeSection
)

export default app
