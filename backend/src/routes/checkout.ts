import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createOrder } from "../controllers/checkout.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { protectedRateLimit } from "../middleware/rate-limit.js";
import { createOrderSchema } from "../schemas/checkout.js";

const app = new Hono()

app.use("*", requireAuth, protectedRateLimit)

app.post("/", zValidator("json", createOrderSchema, customValidationHandler), createOrder)

export default app
