import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import pool from "../db/client.js";
import { customValidationHandler } from "../lib/validator.js";

export const getWishlist = async (c: Context) => {
    const me = c.get("user")

    const wishlistResult = await pool.query(`
        SELECT wi.*, p.base_price, p.title, p.cover_image, p.slug
        FROM wishlist_items wi
        LEFT JOIN products p ON p.id = wi.product_id
        WHERE wi.user_id = $1
        ORDER BY wi.created_at DESC
        `, [me.id])

    return c.json({ wishlist_items: wishlistResult.rows ?? [] })
}

export const addWishlistItem = async (c: Context) => {
    const { product_id } = await c.req.json()

    const me = c.get("user")

    const wishlistResult = await pool.query(`
        INSERT INTO wishlist_items (user_id, product_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, product_id) DO NOTHING
        RETURNING *
        `, [me.id, product_id])

    if (!wishlistResult.rowCount) {
        throw new HTTPException(400, { message: "Item already in wishlist" })
    }

    return c.json({ message: "Item added to wishlist", new_wishlist_item: wishlistResult.rows?.[0] })
}

export const removeWishlistItem = async (c: Context) => {
    const parsed = z.uuid().safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const me = c.get("user")

    const removeResult = await pool.query(`
        DELETE FROM wishlist_items
        WHERE user_id = $1 AND id = $2
        RETURNING *
        `, [me.id, parsed.data])

    if (!removeResult.rowCount) {
        throw new HTTPException(404, { message: "Item not found" })
    }

    return c.json({ message: "Item removed from wishlist" })
}
