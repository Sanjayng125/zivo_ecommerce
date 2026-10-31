import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";
import { razorpay } from "../services/razorpay.js";

export const getOrders = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 20)
    const sort = c.req.query("sort") ?? "newest"

    const me = c.get("user")

    const orderBy: Record<string, string> = {
        newest: "o.created_at DESC",
        oldest: "o.created_at ASC",
        total_asc: "o.total ASC",
        total_desc: "o.total DESC",
    }

    const orderClause = orderBy[sort] ?? "created_at DESC"
    const offset = (page - 1) * limit

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM orders WHERE user_id = $1`,
        [me.id]
    )
    const total = Number(countResult.rows[0].count)

    const ordersResult = await pool.query(`
        WITH order_item AS (
            SELECT
            ois.id,
            ois.order_id,
            ois.title_snapshot,
            p.cover_image
            FROM order_items ois
            LEFT JOIN product_variants pv ON pv.id = ois.variant_id
            LEFT JOIN products p ON p.id = pv.product_id
        )

        SELECT
        o.id,
        o.status,
        o.payment_status,
        o.total,
        o.created_at,
            (SELECT JSONB_AGG(TO_JSONB(oi.*))
            FROM order_item oi
            WHERE oi.order_id = o.id) AS order_items
        FROM orders o
        WHERE o.user_id = $1
        ORDER BY ${orderClause}
        LIMIT $2
        OFFSET $3
        `, [me.id, limit, offset])

    return c.json({
        orders: ordersResult.rows,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    })
}

export const getOrder = async (c: Context) => {
    const order_id = c.req.param("order_id")

    const me = c.get("user")

    const orderResult = await pool.query(`
        WITH order_item AS (
        SELECT
        ois.*,
        pv.product_id,
        pv.sku,
        pv.size,
        pv.color,
        p.cover_image,
        p.rating_avg,
        p.rating_count,
        p.slug
        FROM order_items ois
        LEFT JOIN product_variants pv ON pv.id = ois.variant_id
        LEFT JOIN products p ON p.id = pv.product_id
        )

        SELECT o.*,
            (SELECT JSONB_AGG(TO_JSONB(oi.*))
            FROM order_item oi
            WHERE oi.order_id = o.id) AS order_items
        FROM orders o
        WHERE o.id = $1 AND o.user_id = $2
        `, [order_id, me.id])

    if (!orderResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Order not found" })
    }

    return c.json({ order: orderResult.rows[0] })
}

export const verifyPayment = async (c: Context) => {
    const me = c.get("user")
    const order_id = c.req.param("order_id")

    const orderResult = await pool.query(`
        SELECT id, payment_status, p_gateway_order_id
        FROM orders
        WHERE id = $1 AND user_id = $2
        `, [order_id, me.id])

    if (!orderResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Order not found" })
    }

    const order = orderResult.rows[0]

    if (order.payment_status === "paid") {
        return c.json({ message: "Payment already verified", order })
    }

    if (!order.p_gateway_order_id) {
        throw new HTTPException(400, { message: "No payment gateway order found" })
    }

    const rzpPayments = await razorpay.orders.fetchPayments(order.p_gateway_order_id)
    const capturedPayment = rzpPayments.items.find((p: any) => p.status === "captured")
    const failedPayment = rzpPayments.items.find((p: any) => p.status === "failed")

    if (capturedPayment) {
        const updatedOrder = await pool.query(`
        UPDATE orders
        SET
        payment_status = 'paid',
        status = 'confirmed',
        p_gateway_payment_id = $1
        WHERE id = $2
        RETURNING *
        `, [capturedPayment.id, order_id])

        if (!updatedOrder.rowCount) {
            throw new HTTPException(500, { message: "Failed to update order. Please try again later" })
        }

        return c.json({ message: "Payment verified", order: updatedOrder.rows[0] })
    }

    if (failedPayment) {
        const updatedOrder = await pool.query(`
        UPDATE orders
        SET
        payment_status = 'failed',
        status = 'cancelled',
        p_gateway_payment_id = $1
        WHERE id = $2
        RETURNING *
        `, [failedPayment.id, order_id])

        if (!updatedOrder.rowCount) {
            throw new HTTPException(500, { message: "Failed to update order. Please try again later" })
        }

        await pool.query(`
        UPDATE product_variants pv
        SET stock = pv.stock + ois.quantity
        FROM order_items ois
        WHERE ois.order_id = $1
        AND pv.id = ois.variant_id
        `, [order_id])

        return c.json({ message: "Payment failed", order: updatedOrder.rows[0] })
    }

    return c.json({ message: "Payment not captured yet", order })
}
