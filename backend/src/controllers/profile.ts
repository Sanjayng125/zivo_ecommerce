import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";

export const getProfile = async (c: Context) => {
    const me = c.get("user")

    const profileResult = await pool.query(`
        SELECT
        p.*,
        u.name,
        u.email
        FROM profiles p
        JOIN "user" u ON u."id" = p.id
        WHERE p.id = $1
        `, [me.id])

    if (!profileResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Profile not found" })
    }

    return c.json({ profile: profileResult.rows[0] })
}

export const updateProfile = async (c: Context) => {
    const me = c.get("user")

    const { full_name, phone } = await c.req.json()

    const updateResult = await pool.query(`
        UPDATE profiles
        SET
        full_name = $1,
        phone = $2
        WHERE id = $3
        RETURNING *
        `, [full_name, phone, me.id])

    if (!updateResult.rowCount) {
        throw new HTTPException(404, { message: "Profile not found" })
    }

    return c.json({ message: "Profile updated", updated_profile: updateResult.rows[0] })
}

export const updateAvatar = async (c: Context) => {
    const me = c.get("user")

    const { avatar_url } = await c.req.json()

    const updateResult = await pool.query(`
        UPDATE profiles
        SET
        avatar_url = $1
        WHERE id = $2
        RETURNING *
        `, [avatar_url, me.id])

    if (!updateResult.rowCount) {
        throw new HTTPException(404, { message: "Profile not found" })
    }

    return c.json({ message: "Avatar updated", updated_profile: updateResult.rows[0] })
}

export const getRecentlyViewedProducts = async (c: Context) => {
    const me = c.get("user")

    const productResult = await pool.query(`
        SELECT pv.product_id, pv.viewed_at, p.title, p.cover_image
        FROM product_views pv
        JOIN products p ON p.id = pv.product_id
        WHERE pv.user_id = $1
        ORDER BY pv.viewed_at DESC
        LIMIT 10
        `, [me.id])

    return c.json({ products: productResult.rows })
}
