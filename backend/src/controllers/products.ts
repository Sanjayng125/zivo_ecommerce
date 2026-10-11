import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";
import redis from "../lib/redis.js";

export const getProduct = async (c: Context) => {
    const slug = c.req.param("slug")

    const cached = await redis.get(`product:${slug}`)

    if (cached) {
        return c.json({ product: cached })
    }

    const product = await pool.query(
        `WITH images AS (
        SELECT pi.product_id, JSONB_AGG(to_jsonb(pi.*) ORDER BY pi.sort_order) AS product_images
        FROM product_images pi GROUP BY pi.product_id
        ),
        variants AS (
            SELECT pv.product_id, JSONB_AGG(to_jsonb(pv.*) ORDER BY pv.price) AS product_variants  
            FROM product_variants pv GROUP BY pv.product_id
        )
        SELECT p.*, images.product_images, variants.product_variants
        FROM products p
        JOIN images ON images.product_id = p.id
        JOIN variants ON variants.product_id = p.id
        WHERE p.is_active = true AND p.slug = $1
            `,
        [slug])

    if (!product.rows?.[0]) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    await redis.set(`product:${slug}`, { product: product.rows[0] }, { ex: 3600 })

    return c.json({ product: product.rows[0] })
}

export const addProductView = async (c: Context) => {
    const me = c.get("user")
    const product_id = c.req.param("product_id")

    const productResult = await pool.query(`
        SELECT id
        FROM products
        WHERE id = $1 AND is_active = true
        `, [product_id])

    if (!productResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    await pool.query(`
        INSERT INTO product_views (user_id, product_id, viewed_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET viewed_at = NOW()
        `, [me.id, product_id])

    return c.json({ message: "View recorded" })
}

