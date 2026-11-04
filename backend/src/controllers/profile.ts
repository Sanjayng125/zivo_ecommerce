import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";
import pool from "../db/client.js";
import { deleteImage, generateUploadAuth } from "../services/imagekit.js";

export const getProfile = async (c: Context) => {
    const me = c.get("user")

    const profileResult = await pool.query(`
        SELECT
        u.name,
        u.email,
        p.id,
        p.full_name,
        p.phone,
        p.avatar_url,
        p.updated_at,
        p.created_at
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

    try {
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
    catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
            throw new HTTPException(409, { message: "An account with this phone number already exists." })
        }

        throw error
    }
}

export const getAvatarUploadAuth = async (c: Context) => {
    const me = c.get("user")

    const authParams = generateUploadAuth(`avatars/${me.id}`)

    return c.json({
        ...authParams
    })
}

export const updateAvatar = async (c: Context) => {
    const me = c.get("user")

    const { avatar_url, avatar_file_id } = await c.req.json()

    const profileResult = await pool.query(
        `SELECT avatar_file_id FROM profiles WHERE id = $1`,
        [me.id]
    )

    const oldFileId = profileResult.rows?.[0]?.avatar_file_id

    const updateResult = await pool.query(`
        UPDATE profiles
        SET
        avatar_url = $1,
        avatar_file_id = $2
        WHERE id = $3
        RETURNING *
        `, [avatar_url, avatar_file_id, me.id])

    if (!updateResult.rowCount) {
        throw new HTTPException(404, { message: "Profile not found" })
    }

    if (oldFileId) await deleteImage(oldFileId)

    return c.json({ message: "Avatar updated", updated_profile: updateResult.rows[0] })
}

export const getRecentlyViewedProducts = async (c: Context) => {
    const me = c.get("user")

    const productResult = await pool.query(`
        SELECT pv.id,
        pv.product_id,
        pv.viewed_at,
        p.base_price,
        p.title,
        p.cover_image,
        p.slug,
        p.rating_avg,
        p.rating_count
        FROM product_views pv
        JOIN products p ON p.id = pv.product_id
        WHERE pv.user_id = $1
        ORDER BY pv.viewed_at DESC
        LIMIT 10
        `, [me.id])

    return c.json({ products: productResult.rows })
}
