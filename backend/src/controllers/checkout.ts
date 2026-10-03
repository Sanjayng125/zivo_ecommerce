import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";
import { razorpay, RAZORPAY_KEY_ID } from "../services/razorpay.js";

export const createOrder = async (c: Context) => {
    const client = await pool.connect()
    const me = c.get("user")
    const { address_id } = await c.req.json()

    try {
        await client.query('BEGIN')

        const cartResult = await client.query(`
        SELECT
        ci.variant_id,
        ci.quantity,
        pv.price,
        pv.stock,
        p.title,
        TO_JSONB(pv.*) AS variant
        FROM cart_items ci
        JOIN product_variants pv ON pv.id = ci.variant_id
        JOIN products p ON p.id = pv.product_id
        WHERE ci.user_id = $1
        ORDER BY ci.updated_at DESC
        `, [me.id])

        if (!cartResult.rows.length) {
            throw new HTTPException(400, { message: "Your cart is empty" })
        }

        const addressesResult = await client.query(`
        SELECT * FROM addresses
        WHERE user_id = $1 AND id = $2
        `, [me.id, address_id])

        if (!addressesResult.rows.length) {
            throw new HTTPException(400, { message: "Address not found" })
        }

        let subtotal = 0

        for (const cart_item of cartResult.rows) {
            if (cart_item.stock < cart_item.quantity) {
                throw new HTTPException(400, { message: `Insufficient stock for ${cart_item?.title}` })
            }

            subtotal += cart_item.price * cart_item.quantity

            const result = await client.query(`
                UPDATE product_variants
                SET stock = stock - $1
                WHERE id = $2
                AND stock >= $1
            `, [cart_item.quantity, cart_item.variant_id])

            if (!result.rowCount) {
                throw new HTTPException(400, {
                    message: `Insufficient stock for ${cart_item.title}`
                })
            }
        }

        const shipping = subtotal > 50000 ? 0 : 4000
        const total = subtotal + shipping

        const orderResult = await client.query(`
            INSERT INTO orders (user_id, subtotal, shipping, total, address_snapshot)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `, [me.id, subtotal, shipping, total, addressesResult.rows[0]])

        if (!orderResult.rowCount) {
            throw new HTTPException(400, { message: "Failed to create order" })
        }

        for (const cart_item of cartResult.rows) {
            const orderItemResult = await client.query(`
                    INSERT INTO order_items (order_id, variant_id, title_snapshot, variant_snapshot, price_snapshot, quantity)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    `, [orderResult.rows[0].id, cart_item.variant_id, cart_item.title, cart_item.variant, cart_item.price, cart_item.quantity])

            if (!orderItemResult.rowCount) {
                throw new HTTPException(400, { message: "Failed to create order" })
            }
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: total,
            currency: "INR",
            receipt: orderResult.rows[0].id
        })

        const updateOrderResult = await client.query(`
            UPDATE orders
            SET p_gateway_order_id = $1
            WHERE id = $2
            `, [razorpayOrder.id, orderResult.rows[0].id])

        if (!updateOrderResult.rowCount) {
            throw new HTTPException(400, { message: "Failed to create order" })
        }

        await client.query('COMMIT')

        try {
            await pool.query(`
            DELETE FROM cart_items
            WHERE user_id = $1
            `, [me.id])
        } catch (error) { }

        return c.json({ order_id: orderResult.rows[0].id, razorpay_order_id: razorpayOrder.id, amount: total, currency: "INR", key_id: RAZORPAY_KEY_ID })
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}
