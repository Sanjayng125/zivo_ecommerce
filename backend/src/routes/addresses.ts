import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addresses.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { protectedRateLimit } from "../middleware/rate-limit.js";
import { addressIdSchema, addressSchema } from "../schemas/addresses.js";

const app = new Hono()

app.use("*", requireAuth, protectedRateLimit)

app.get("/", getAddresses)
app.post("/", zValidator("json", addressSchema, customValidationHandler), addAddress)
app.patch("/:address_id",
    zValidator("param", addressIdSchema, customValidationHandler),
    zValidator("json", addressSchema, customValidationHandler),
    updateAddress
)
app.delete("/:address_id", zValidator("param", addressIdSchema, customValidationHandler), deleteAddress)

export default app
