import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import pool from "../db/client.js";
import { customValidationHandler } from "../lib/validator.js";

export const getUsers = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 10)
    const sort = c.req.query("sort") ?? "newest"
    const q = c.req.query("q")?.trim()
    const role = c.req.query("role")

    const conditions: string[] = ["TRUE"]
    const params: unknown[] = []

    if (q) {
        params.push(`%${q}%`)
        conditions.push(`(u.name ILIKE $${params.length} OR u.email ILIKE $${params.length})`)
    }
    if (role) {
        params.push(role)
        conditions.push(`p.role = $${params.length}`)
    }

    const orderBy: Record<string, string> = {
        newest: 'u."createdAt" DESC',
        oldest: 'u."createdAt" ASC',
        name_asc: 'u.name ASC',
        name_desc: 'u.name DESC',
    }

    const whereClause = conditions.join(" AND ");

    const totalResult = await pool.query(`
        SELECT COUNT(u.id)
        FROM "user" u
        JOIN profiles p ON p.id = u.id
        WHERE ${whereClause}
        `, params)
    const total = Number(totalResult.rows[0].count)

    const orderByClause = orderBy[sort] ?? 'u."createdAt" DESC'
    const offset = (page - 1) * limit;

    params.push(limit)
    params.push(offset)

    const usersResult = await pool.query(`
        SELECT
        u.id,
        u.name,
        u.email,
        u."emailVerified",
        u."createdAt",
        p.role,
        p.phone,
        p.avatar_url
        FROM "user" u
        JOIN profiles p ON p.id = u.id
        WHERE ${whereClause}
        ORDER BY ${orderByClause}
        LIMIT $${params.length - 1}
        OFFSET $${params.length}
        `, params)

    return c.json({
        users: usersResult.rows ?? [],
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    })
}

export const getUser = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid user ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: user_id } = parsed

    const userResult = await pool.query(`
        SELECT
        u.id,
        u.name,
        u.email,
        u."emailVerified",
        u."createdAt",
        p.role,
        p.phone,
        p.avatar_url
        FROM "user" u
        JOIN profiles p ON p.id = u.id
        WHERE u.id = $1
        `, [user_id])

    if (!userResult.rows?.[0]) {
        throw new HTTPException(404, { message: "User not found" })
    }

    return c.json({ user: userResult.rows[0] })
}

export const updateUserRole = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid user ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: user_id } = parsed
    const me = c.get("user")

    if (me.id === user_id) {
        throw new HTTPException(400, { message: "You cannot change your own role" })
    }

    const { role } = await c.req.json()

    const userResult = await pool.query(`
        UPDATE profiles
        SET role = $1
        WHERE id = $2
        RETURNING *
        `, [role, user_id])

    if (!userResult.rowCount) {
        throw new HTTPException(404, { message: "User not found" })
    }

    return c.json({ user: userResult.rows[0], message: "User role updated" })
}
