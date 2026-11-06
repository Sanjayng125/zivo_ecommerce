import { Context, Next } from "hono"
import { HTTPException } from "hono/http-exception"
import { auth } from "../lib/auth.js"

export const optionalAuth = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    })

    if (session) {
        c.set("user", session.user)
        c.set("session", session.session)
    }

    await next()
}

export const requireAuth = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    })

    if (!session) {
        throw new HTTPException(401, { message: "Unauthorized" })
    }

    c.set("user", session.user)
    c.set("session", session.session)

    await next()
}

export const requireAdmin = async (c: Context, next: Next) => {
    const user = c.get("user")

    if (user.role !== "admin") {
        throw new HTTPException(403, { message: "Forbidden" })
    }

    await next()
}
