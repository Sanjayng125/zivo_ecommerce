import { Context, Hono } from "hono";
import { auth } from "../lib/auth.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimit } from "../middleware/rate-limit.js";

const app = new Hono()

app.use("*", authRateLimit)

app.delete("/sign-out", requireAuth, async (c: Context) => {
    const token = c.get("session")?.token

    await auth.api.revokeSession({ headers: c.req.raw.headers, body: { token } })

    return c.json({ message: "Signed out" })
})
app.all("*", (c) => auth.handler(c.req.raw));

export default app
