import { Context } from "hono";
import pool from "../db/client.js";

export const cleanupPendingOrders = async (c: Context) => {
    const secret = c.req.header("x-cron-secret")
    if (secret !== process.env.CRON_SECRET) {
        return c.json({ message: "Unauthorized" }, 401)
    }

    await pool.query(`
            UPDATE product_variants pv
            SET stock = pv.stock + oi.quantity
            FROM order_items oi
            JOIN orders o ON o.id = oi.order_id
            WHERE pv.id = oi.variant_id
            AND o.payment_status = 'pending'
            AND o.created_at < NOW() - INTERVAL '60 minutes';

            UPDATE orders
            SET payment_status = 'failed', status = 'cancelled'
            WHERE payment_status = 'pending'
            AND created_at < NOW() - INTERVAL '60 minutes';
        `)

    return c.json({ success: true })
}
