import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import pool from "../db/client.js";
import { customValidationHandler } from "../lib/validator.js";
import { updateCartItemSchema } from "../schemas/cart.js";

export const getCart = async (c: Context) => {
    const me = c.get("user")

    const cartResult = await pool.query(`
        SELECT ci.*, pv.product_id, pv.price, pv.stock, p.title, p.cover_image FROM cart_items ci
        LEFT JOIN product_variants pv ON pv.id = ci.variant_id
        LEFT JOIN products p ON p.id = pv.product_id
        WHERE ci.user_id = $1
        ORDER BY ci.updated_at DESC
        `, [me.id])

    return c.json({ cart_items: cartResult.rows })
}

export const addCartItem = async (c: Context) => {
    const { variant_id, quantity = 1 } = await c.req.json()
    const me = c.get("user")

    const cartResult = await pool.query(`
        INSERT INTO cart_items (user_id, variant_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, variant_id)
        DO UPDATE
        SET quantity = cart_items.quantity + EXCLUDED.quantity
        RETURNING *
        `, [me.id, variant_id, quantity])

    if (!cartResult.rows?.[0]) {
        throw new HTTPException(500, { message: "Something went wrong while adding item to cart" })
    }

    return c.json({ cart_item: cartResult.rows?.[0], message: "Item added to cart" })
}

export const updateQuantity = async (c: Context) => {
    const item_id = c.req.param("item_id")
    const { quantity } = await c.req.json()

    const parsed = updateCartItemSchema.safeParse({ item_id, quantity })

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    if (!parsed.data) {
        throw new HTTPException(400, {
            message: "Invalid data"
        })
    }

    const me = c.get("user")

    const cartResult = await pool.query(`
        UPDATE cart_items
        SET quantity = $1
        WHERE user_id = $2 AND id = $3
        RETURNING *
        `, [parsed.data.quantity, me.id, parsed.data.item_id])

    if (!cartResult.rows[0]) {
        throw new HTTPException(404, {
            message: "Cart item not found"
        })
    }

    return c.json({ cart_item: cartResult.rows?.[0], message: "Cart item quantity updated" })
}

export const removeCartItem = async (c: Context) => {
    const parsed = z.uuid().safeParse(c.req.param("item_id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const me = c.get("user")

    const cartResult = await pool.query(`
        DELETE FROM cart_items
        WHERE user_id = $1 AND id = $2
        RETURNING id
        `, [me.id, parsed.data])

    if (!cartResult.rows[0]) {
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
