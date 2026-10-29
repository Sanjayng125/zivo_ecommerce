import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";
import redis from "../lib/redis.js";

export const searchProducts = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 20)
    const sort = c.req.query("sort") ?? "newest"
    const category_id = c.req.query("category_id")
    const min_price = c.req.query("min_price")
    const max_price = c.req.query("max_price")
    const searchQuery = c.req.query("q")?.trim()

    const conditions: string[] = ["is_active = true AND EXISTS (SELECT 1 FROM product_images WHERE product_id = products.id) AND EXISTS (SELECT 1 FROM product_variants WHERE product_id = products.id)"]
    const params: unknown[] = []

    let searchParamIndex: number | null = null
    if (searchQuery) {
        params.push(searchQuery)
        searchParamIndex = params.length
        conditions.push(`search_vector @@ websearch_to_tsquery('english', $${params.length})`)
    }
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

    const whereClause = conditions.join(" AND ")

    const countResult = await pool.query(`
        SELECT COUNT(*)
        FROM products
        WHERE ${whereClause}
        `, params)

    const orderBy: Record<string, string> = {
        newest: "created_at DESC",
        oldest: "created_at ASC",
        price_asc: "base_price ASC",
        price_desc: "base_price DESC",
        rating: "rating_avg DESC"
    }

    const total = Number(countResult.rows[0].count)

    const orderClause = searchQuery ?
        (sort === "newest"
            ? "rank DESC"
            : orderBy[sort] ?? "rank DESC") : "created_at DESC"
    const offset = (page - 1) * limit

    params.push(limit)
    params.push(offset)

    const products = await pool.query(`
        SELECT
        id,
        title,
        description,
        slug,
        base_price,
        cover_image,
        rating_avg,
        rating_count,
        category_id,
        ${searchParamIndex
            ? `ts_rank(search_vector, websearch_to_tsquery('english', $${searchParamIndex})) AS rank`
            : 'NULL AS rank'}
        FROM products
        WHERE ${whereClause}
        ORDER BY ${orderClause}
        LIMIT $${params.length - 1}
        OFFSET $${params.length}
        `, params)

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

    const cached = await redis.get(`product:${slug}`)

    if (cached) {
        return c.json(cached)
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

