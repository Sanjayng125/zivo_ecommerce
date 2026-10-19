import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";

export const getMyProductReview = async (c: Context) => {
    const me = c.get("user")
    const product_id = c.req.param("product_id")

    const reviewResult = await pool.query(`
        SELECT r.*, p.full_name, p.avatar_url
        FROM reviews r
        JOIN profiles p ON p.id = r.user_id
        WHERE r.product_id = $1 AND r.user_id = $2
        `, [product_id, me.id])

    return c.json({ my_review: reviewResult.rows[0] ?? null })
}

export const getProductReviews = async (c: Context) => {
    const product_id = c.req.param("product_id")
    const me = c.get("user")

    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 10)
    const sort = c.req.query("sort") ?? "default"

    const conditions: string[] = ["r.product_id = $1"]
    const params: unknown[] = [product_id]

    if (me?.id) {
        params.push(me.id)
        conditions.push(`r.user_id != $${params.length}`)
    }

    const orderBy: Record<string, string> = {
        default: "r.created_at DESC, r.rating DESC",
        newest: "r.created_at DESC",
        oldest: "r.created_at ASC",
        rating_desc: "r.rating DESC",
        rating_asc: "r.rating ASC",
    }

    const whereClause = conditions.join(" AND ")
    const orderClause = orderBy[sort] ?? orderBy.default
    const offset = (page - 1) * limit

    const countResult = await pool.query(
        `SELECT COUNT(r.id) FROM reviews r WHERE ${whereClause}`,
        params
    )

    const total = Number(countResult.rows[0].count)
    params.push(limit, offset)

    const reviewsResult = await pool.query(`
        SELECT r.*, p.full_name, p.avatar_url
        FROM reviews r
        JOIN profiles p ON p.id = r.user_id
        WHERE ${whereClause}
        ORDER BY ${orderClause}
        LIMIT $${params.length - 1}
        OFFSET $${params.length}
        `, params)

    return c.json({
        reviews: reviewsResult.rows ?? [],
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    })
}

export const createProductReview = async (c: Context) => {
    const me = c.get("user")
    const product_id = c.req.param("product_id")

    const { rating, title, comment } = await c.req.json()

    const productResult = await pool.query(`
        SELECT id, rating_avg, rating_count
        FROM products
        WHERE id = $1
        `, [product_id])

    if (!productResult.rowCount) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    const reviewResult = await pool.query(`
        INSERT INTO reviews (user_id, product_id, rating, title, comment)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, product_id)
        DO UPDATE
        SET
        rating = EXCLUDED.rating,
        title = EXCLUDED.title,
        comment = EXCLUDED.comment,
        updated_at = NOW()
        RETURNING *
        `, [me.id, product_id, rating, title, comment])

    if (!reviewResult.rowCount) {
        throw new HTTPException(500, { message: "Something went wrong while creating review" })
    }

    await pool.query(`
        WITH ratings AS (
        SELECT AVG(rating) AS rating_avg, COUNT(rating) AS rating_count
        FROM reviews
        WHERE product_id = $1
        GROUP BY product_id
        )

        UPDATE products
        SET rating_avg = ratings.rating_avg, rating_count = ratings.rating_count
        FROM ratings
        WHERE id = $1
        `, [product_id])

    return c.json({ review: reviewResult.rows[0], message: "Review added" })
}

export const deleteProductReview = async (c: Context) => {
    const me = c.get("user")
    const review_id = c.req.param("review_id")

    const reviewResult = await pool.query(`
        DELETE FROM reviews
        WHERE user_id = $1 AND id = $2
        RETURNING *
        `, [me.id, review_id])

    if (!reviewResult.rowCount) {
        throw new HTTPException(404, { message: "Review not found" })
    }

    await pool.query(`
        WITH ratings AS (
        SELECT AVG(rating) AS rating_avg, COUNT(rating) AS rating_count
        FROM reviews
        WHERE product_id = $1
        GROUP BY product_id
        )

        UPDATE products
        SET
        rating_avg = CASE WHEN ratings.rating_count = 0 THEN 0 ELSE ratings.rating_avg END,
        rating_count = CASE WHEN ratings.rating_count = 0 THEN 0 ELSE ratings.rating_count END
        FROM ratings
        WHERE id = $1
        `, [reviewResult.rows[0].product_id])

    return c.json({ message: "Review deleted" })
}

export const updateProductReview = async (c: Context) => {
    const me = c.get("user")
    const review_id = c.req.param("review_id")

    const { rating, title, comment } = await c.req.json()

    const reviewResult = await pool.query(`
        UPDATE reviews
        SET
        rating = $1,
        title = $2,
        comment = $3
        WHERE user_id = $4 AND id = $5
        RETURNING *
        `, [rating, title, comment, me.id, review_id])

    if (!reviewResult.rowCount) {
        throw new HTTPException(404, { message: "Review not found" })
    }

    await pool.query(`
        WITH ratings AS (
        SELECT AVG(rating) AS rating_avg, COUNT(rating) AS rating_count
        FROM reviews
        WHERE product_id = $1
        GROUP BY product_id
        )

        UPDATE products p
        SET rating_avg = r.rating_avg, rating_count = r.rating_count
        FROM ratings r
        WHERE p.id = $1
        `, [reviewResult.rows[0].product_id])

    return c.json({ review: reviewResult.rows[0], message: "Review updated" })
}
