import { Worker } from "bullmq";
import pool from "../db/client.js";
import { ioRedisConnection } from "../lib/redis.js";

const paymentsWorker = new Worker(
    "payments",
    async (job) => {
        const { payload } = job.data.parsed
        const { order_id: razorpay_order_id, id: razorpay_payment_id } = payload.payment.entity

        if (!razorpay_order_id || !razorpay_payment_id) return

        const orderItemsResult = await pool.query(`
                SELECT
                ois.variant_id,
                ois.quantity
                FROM orders o
                JOIN order_items ois ON ois.order_id = o.id
                WHERE p_gateway_order_id = $1
        `, [razorpay_order_id])

        if (orderItemsResult.rows?.length === 0) {
            return
        }

        if (job.name === "payment.captured") {
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

        if (job.name === "payment.failed") {
            await pool.query(`
                UPDATE orders
                SET
                payment_status = 'failed',
                status = 'cancelled',
                p_gateway_payment_id = $1
                WHERE p_gateway_order_id = $2
                RETURNING *
            `, [razorpay_payment_id, razorpay_order_id])

            await pool.query(`
                UPDATE product_variants pv
                SET stock = pv.stock + ois.quantity
                FROM order_items ois
                WHERE ois.order_id = (SELECT id FROM orders WHERE p_gateway_order_id = $1)
                AND pv.id = ois.variant_id
            `, [razorpay_order_id])
        }
    },
    {
        connection: ioRedisConnection,
        prefix: "payments",
    }
);

paymentsWorker.on("completed", (job) => console.log(`Job ${job.id} completed`))
paymentsWorker.on("failed", (job, err) => console.error(`Job ${job?.id} failed:`, err))
