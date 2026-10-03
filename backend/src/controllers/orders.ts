import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";

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
    const id = c.req.param("id")

    const me = c.get("user")

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
        WHERE o.user_id = $1 AND o.id = $2
        `, [me.id, id])

    if (!orderResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Order not found" })
    }

    return c.json({ order: orderResult.rows[0] })
}
