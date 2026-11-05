import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getImageUploadAuth } from "../../controllers/admin/upload.js";
import { customValidationHandler } from "../../lib/validator.js";
import { getImageUploadAuthSchema } from "../../schemas/upload.js";

const app = new Hono()

app.post("/:entity_id", zValidator("json", getImageUploadAuthSchema, customValidationHandler), getImageUploadAuth)

export default app
