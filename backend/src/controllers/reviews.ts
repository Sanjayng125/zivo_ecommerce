import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import pool from "../db/client.js";
import { customValidationHandler } from "../lib/validator.js";

export const getProductReviews = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid product ID" }).safeParse(c.req.param("product_id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 10)
    const sort = c.req.query("sort") ?? "newest"

    const orderBy: Record<string, string> = {
        newest: "r.created_at DESC",
        oldest: "r.created_at ASC",
        rating_desc: "r.rating DESC",
        rating_asc: "r.rating ASC",
    }

    const orderClause = orderBy[sort] ?? "created_at DESC"
    const offset = (page - 1) * limit

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM reviews WHERE product_id = $1`,
        [parsed.data]
    )

    const total = Number(countResult.rows[0].count)

    const reviewsResult = await pool.query(`
        SELECT r.*, p.full_name, p.avatar_url
        FROM reviews r
        JOIN profiles p ON p.id = r.user_id
        WHERE r.product_id = $1
        ORDER BY ${orderClause}
        LIMIT $2
        OFFSET $3
        `, [parsed.data, limit, offset])

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
    const parsed = z.uuid({ error: "Invalid product ID" }).safeParse(c.req.param("product_id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { rating, comment } = await c.req.json()

    const productResult = await pool.query(`
        SELECT id, rating_avg, rating_count
        FROM products
        WHERE id = $1
        `, [parsed.data])

    if (!productResult.rowCount) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    const reviewResult = await pool.query(`
        INSERT INTO reviews (user_id, product_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, product_id)
        DO UPDATE
        SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, updated_at = NOW()
        RETURNING *
        `, [me.id, parsed.data, rating, comment])

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
        WHERE id = $1
        `, [parsed.data])

    return c.json({ review: reviewResult.rows[0], message: "Review added" })
}

export const deleteProductReview = async (c: Context) => {
    const me = c.get("user")
    const parsed = z.uuid({ error: "Invalid review ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const reviewResult = await pool.query(`
        DELETE FROM reviews
        WHERE user_id = $1 AND id = $2
        RETURNING *
        `, [me.id, parsed.data])

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
        WHERE id = $1
        `, [reviewResult.rows[0].product_id])

    return c.json({ message: "Review deleted" })
}

export const updateProductReview = async (c: Context) => {
    const me = c.get("user")
    const parsed = z.uuid({ error: "Invalid review ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { rating, comment } = await c.req.json()

    const reviewResult = await pool.query(`
        UPDATE reviews
        SET rating = $1, comment = $2
        WHERE user_id = $3 AND id = $4
        RETURNING *
        `, [rating, comment, me.id, parsed.data])

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
        SET rating_avg = ratings.rating_avg, rating_count = ratings.rating_count
        WHERE id = $1
        `, [reviewResult.rows[0].product_id])

    return c.json({ review: reviewResult.rows[0], message: "Review updated" })
}
