import { Context, Next } from "hono"
import pool from "../db/client.js"
import { auth } from "../lib/auth.js"

export const requireAuth = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    })

    if (!session) {
        return c.json({ message: "Unauthorized" }, 401)
    }

    c.set("user", session.user)
    c.set("session", session.session)

    await next()
}

export const requireAdmin = async (c: Context, next: Next) => {
    const user = c.get("user")

    const result = await pool.query(
        `SELECT role FROM profiles WHERE id = $1`,
        [user.id]
    )

    if (!result.rows[0] || result.rows[0].role !== "admin") {
        return c.json({ message: "Forbidden" }, 403)
    }

    await next()
}
