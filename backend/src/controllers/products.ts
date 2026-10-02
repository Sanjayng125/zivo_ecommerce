import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";

export const getProducts = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 20)
    const sort = c.req.query("sort") ?? "newest"
    const category_id = c.req.query("category_id")
    const min_price = c.req.query("min_price")
    const max_price = c.req.query("max_price")

    const conditions: string[] = ["is_active = true"]
    const params: unknown[] = []

    if (category_id) {
        params.push(category_id)
        conditions.push(`category_id = $${params.length}`)
    }
    if (min_price) {
        params.push(Number(min_price))
        conditions.push(`base_price >= $${params.length}`)
    }
    if (max_price) {
        params.push(Number(max_price))
        conditions.push(`base_price <= $${params.length}`)
    }

    const orderBy: Record<string, string> = {
        newest: "created_at DESC",
        oldest: "created_at ASC",
        price_asc: "base_price ASC",
        price_desc: "base_price DESC",
        rating: "rating_avg DESC"
    }

    const whereClause = conditions.join(" AND ")
    const orderClause = orderBy[sort] ?? "created_at DESC"
    const offset = (page - 1) * limit

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM products WHERE ${whereClause}`,
        params
    )
    const total = Number(countResult.rows[0].count)

    params.push(limit)
    params.push(offset)

    const products = await pool.query(
        `SELECT * FROM products
         WHERE ${whereClause}
         ORDER BY ${orderClause}
         LIMIT $${params.length - 1}
         OFFSET $${params.length}`,
        params
    )

    return c.json({
        products: products.rows,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    })
}

export const getProduct = async (c: Context) => {
    const slug = c.req.param("slug")

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
        LEFT JOIN images ON images.product_id = p.id
        LEFT JOIN variants ON variants.product_id = p.id
        WHERE p.is_active = true AND p.slug = $1
            `,
        [slug])

    if (!product.rows?.[0]) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    return c.json({ product: product.rows[0] })
}
