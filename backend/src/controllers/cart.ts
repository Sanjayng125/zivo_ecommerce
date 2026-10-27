import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";

export const getCart = async (c: Context) => {
    const me = c.get("user")
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 10)

    const total = await pool.query(`
        SELECT COUNT(ci.id) FROM cart_items ci WHERE ci.user_id = $1
        `, [me.id])

    const offset = (page - 1) * limit

    const cartResult = await pool.query(`
        SELECT ci.*,
        pv.product_id,
        pv.price,
        pv.stock,
        p.title,
        p.cover_image,
        pv.size,
        pv.color,
        p.slug
        FROM cart_items ci
        LEFT JOIN product_variants pv ON pv.id = ci.variant_id
        LEFT JOIN products p ON p.id = pv.product_id
        WHERE ci.user_id = $1
        ORDER BY ci.updated_at DESC
        LIMIT $2
        OFFSET $3
        `, [me.id, limit, offset])

    return c.json({
        cart_items: cartResult.rows ?? [],
        pagination: {
            page,
            limit,
            total: Number(total.rows[0].count),
            total_pages: Math.ceil(Number(total.rows[0].count) / limit)
        }
    })
}

export const addCartItem = async (c: Context) => {
    const { variant_id, quantity = 1 } = await c.req.json()
    const me = c.get("user")

    const variant = await pool.query(`
        SELECT pv.*,
        (SELECT p.slug FROM products p WHERE p.id = pv.product_id) AS slug
        FROM product_variants pv
        WHERE pv.id = $1
        `, [variant_id])

    if (!variant.rows?.[0]) {
        throw new HTTPException(404, {
            message: "Variant not found"
        })
    }

    const cartResult = await pool.query(`
        INSERT INTO cart_items (user_id, variant_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, variant_id)
        DO UPDATE
        SET quantity = cart_items.quantity + EXCLUDED.quantity
        RETURNING *
        `, [me.id, variant_id, quantity])

    if (!cartResult.rowCount) {
        throw new HTTPException(500, { message: "Something went wrong while adding item to cart" })
    }

    return c.json({
        cart_item: {
            ...cartResult.rows?.[0],
            title: variant.rows?.[0].title,
            slug: variant.rows?.[0].slug,
            price: variant.rows?.[0].price,
            cover_image: variant.rows?.[0].cover_image,
            size: variant.rows?.[0].size,
            color: variant.rows?.[0].color,
        },
        message: "Item added to cart"
    }, 201)
}

export const updateQuantity = async (c: Context) => {
    const item_id = c.req.param("item_id")
    const { quantity } = await c.req.json()

    const me = c.get("user")

    const cartResult = await pool.query(`
        UPDATE cart_items
        SET quantity = $1
        WHERE user_id = $2 AND id = $3
        RETURNING *
        `, [quantity, me.id, item_id])

    if (!cartResult.rowCount) {
        throw new HTTPException(404, {
            message: "Cart item not found"
        })
    }

    return c.json({ cart_item: cartResult.rows?.[0], message: "Cart item quantity updated" })
}

export const removeCartItem = async (c: Context) => {
    const item_id = c.req.param("item_id")

    const me = c.get("user")

    const cartResult = await pool.query(`
        DELETE FROM cart_items
        WHERE user_id = $1 AND id = $2
        RETURNING id
        `, [me.id, item_id])

    if (!cartResult.rowCount) {
        throw new HTTPException(404, {
            message: "Cart item not found"
        })
    }

    return c.json({ message: "Cart item removed" })
}

export const clearCart = async (c: Context) => {
    const me = c.get("user")

    await pool.query(`
        DELETE FROM cart_items
        WHERE user_id = $1
        `, [me.id])

    return c.json({ message: "Cart was cleared" })
}
