import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addresses.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { addressIdSchema, addressSchema } from "../schemas/addresses.js";

const app = new Hono()

app.get("/", requireAuth, getAddresses)
app.post("/", requireAuth, zValidator("json", addressSchema, customValidationHandler), addAddress)
app.patch("/:address_id",
    requireAuth,
    zValidator("param", addressIdSchema, customValidationHandler),
    zValidator("json", addressSchema, customValidationHandler),
    updateAddress
)
app.delete("/:address_id", requireAuth, zValidator("param", addressIdSchema, customValidationHandler), deleteAddress)

export default app
