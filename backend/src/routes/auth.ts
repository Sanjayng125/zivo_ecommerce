import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { adminSignIn, getSession } from "../controllers/auth.js";
import { auth } from "../lib/auth.js";
import { customValidationHandler } from "../lib/validator.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimit } from "../middleware/rate-limit.js";
import { adminSignInSchema } from "../schemas/auth.js";

const app = new Hono()

app.use("*", authRateLimit)

app.post("/admin/sign-in", zValidator("json", adminSignInSchema, customValidationHandler), adminSignIn);

app.get("/me", requireAuth, getSession)

app.on(
    ["GET", "POST"],
    [
        "/sign-in/*",
        "/sign-up/*",
        "/sign-out/*",
        "/get-session/*",
        "/callback/*",
        "/verify/*",
        "/forgot-password/*",
        "/reset-password/*",
        "/magic-link/*",
        "/error",
        "/ok",
    ],
    (c) => auth.handler(c.req.raw)
);

export default app
