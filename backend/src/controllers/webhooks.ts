import crypto from "crypto";
import { Context } from "hono";
import pool from "../db/client.js";
import { RAZORPAY_KEY_SECRET } from "../services/razorpay.js";

export const verifyOrder = async (c: Context) => {
    const body = await c.req.text()
    const signature = c.req.header("x-razorpay-signature")
    const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex")

    if (expected !== signature) {
        return c.json({ message: "Invalid signature" }, 400)
    }

    const parsed = JSON.parse(body)

    const paymentSuccess = parsed.event === "payment.captured"
    const paymentFailed = parsed.event === "payment.failed"

    const razorpay_order_id = parsed.payload.payment.entity.order_id
    const razorpay_payment_id = parsed.payload.payment.entity.id

    const orderItemsResult = await pool.query(`
        SELECT
        ois.variant_id,
        ois.quantity
        FROM orders o
        JOIN order_items ois ON ois.order_id = o.id
        WHERE p_gateway_order_id = $1
        `, [razorpay_order_id])

    if (orderItemsResult.rows?.length === 0) {
        return c.json({ received: true }, 200)
    }

    if (paymentSuccess) {
        await pool.query(`
            UPDATE orders
            SET
            payment_status = 'paid',
            status = 'confirmed',
            p_gateway_payment_id = $1
            WHERE p_gateway_order_id = $2
            RETURNING *
            `, [razorpay_payment_id, razorpay_order_id])
    }
    if (paymentFailed) {
        await pool.query(`
            UPDATE orders
            SET
            payment_status = 'failed',
            status = 'cancelled'
            WHERE p_gateway_order_id = $1
            RETURNING *
            `, [razorpay_order_id])

        for (const order_item of orderItemsResult.rows) {
            await pool.query(`
            UPDATE product_variants
            SET stock = stock + $1
            WHERE id = $2
            `, [order_item.quantity, order_item.variant_id])
        }
    }

    return c.json({ received: true }, 200)
}
