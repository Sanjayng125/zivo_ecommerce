import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import z from "zod"
import pool from "../../db/client.js"
import { customValidationHandler } from "../../lib/validator.js"

export const getOrders = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 20)
    const sort = c.req.query("sort") ?? "newest"
    const status = c.req.query("status")
    const payment_status = c.req.query("payment_status")
    const user_id = c.req.query("user_id")

    const conditions: string[] = ["TRUE"]
    const params: unknown[] = []

    if (status) {
        params.push(status)
        conditions.push(`status = $${params.length}`)
    }
    if (payment_status) {
        params.push(payment_status)
        conditions.push(`payment_status = $${params.length}`)
    }
    if (user_id) {
        params.push(user_id)
        conditions.push(`user_id = $${params.length}`)
    }

    const orderBy: Record<string, string> = {
        newest: "o.created_at DESC",
        oldest: "o.created_at ASC",
        total_asc: "o.total ASC",
        total_desc: "o.total DESC",
    }

    const whereClause = conditions.join(" AND ");
    const orderClause = orderBy[sort] ?? "created_at DESC"
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM orders WHERE ${whereClause}`,
        params
    )
    const total = Number(countResult.rows[0].count)

    params.push(limit)
    params.push(offset)

    const ordersResult = await pool.query(`
        WITH order_item AS
        (SELECT
        ois.id,
        ois.order_id,
        ois.title_snapshot,
        p.cover_image,
        p.rating_avg,
        p.rating_count
        FROM order_items ois
        LEFT JOIN product_variants pv ON pv.id = ois.variant_id
        JOIN products p ON p.id = pv.product_id
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
        WHERE ${whereClause}
        ORDER BY ${orderClause}
        LIMIT $${params.length - 1}
        OFFSET $${params.length}
        `, params)

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
    const id = c.req.param("id")

    const orderResult = await pool.query(`
        WITH order_item AS
        (SELECT ois.*,
                pv.sku,
                pv.size,
                pv.color,
                p.cover_image,
                p.rating_avg,
                p.rating_count
        FROM order_items ois
        LEFT JOIN product_variants pv ON pv.id = ois.variant_id
        JOIN products p ON p.id = pv.product_id
        )

        SELECT o.*,
            (SELECT JSONB_AGG(TO_JSONB(oi.*))
            FROM order_item oi
            WHERE oi.order_id = o.id) AS order_items
        FROM orders o
        WHERE o.id = $1
        `, [id])

    if (!orderResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Order not found" })
    }

    return c.json({ order: orderResult.rows[0] })
}

export const updateOrderStatus = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid order ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: order_id } = parsed

    const { status } = await c.req.json()

    const orderResult = await pool.query(`
        SELECT * FROM orders
        WHERE id = $1
        `, [order_id])

    if (!orderResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Order not found" })
    }

    const orderStatus = orderResult.rows[0].status

    if (orderStatus === "delivered" || orderStatus === "cancelled") {
        throw new HTTPException(400, { message: "Status cannot be updated" })
    }

    if (orderStatus === "placed" && !["confirmed", "cancelled"].includes(status)) {
        throw new HTTPException(400, { message: "Invalid status" })
    }
    if (orderStatus === "confirmed" && !["shipped", "cancelled"].includes(status)) {
        throw new HTTPException(400, { message: "Invalid status" })
    }
    if (orderStatus === "shipped" && !["delivered"].includes(status)) {
        throw new HTTPException(400, { message: "Invalid status" })
    }

    const orderUpdateResult = await pool.query(`
        UPDATE orders
        SET status = $1
        WHERE id = $2
        RETURNING *
        `, [status, order_id])

    if (!orderUpdateResult.rowCount) {
        throw new HTTPException(404, { message: "Order not found" })
    }

    return c.json({ order: orderUpdateResult.rows[0], message: "Order status updated" })
}
