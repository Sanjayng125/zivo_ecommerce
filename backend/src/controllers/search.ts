import { Context } from "hono";
import z from "zod";
import pool from "../db/client.js";
import { customValidationHandler } from "../lib/validator.js";

export const searchProducts = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 20)
    const sort = c.req.query("sort") ?? "newest"
    const category_id = c.req.query("category_id")
    const min_price = c.req.query("min_price")
    const max_price = c.req.query("max_price")

    const parsedSearchQuery = z.string().min(2).safeParse(c.req.query("q"))

    if (!parsedSearchQuery.success) {
        customValidationHandler(parsedSearchQuery)
    }

    const searchQuery = parsedSearchQuery.data

    const conditions: string[] = ["is_active = true"]
    const params: unknown[] = []

    if (category_id) {
        params.push(category_id)
        conditions.push(`category_id = $${params.length}`)
    }
    if (searchQuery) {
        params.push(searchQuery)
        conditions.push(`(title ILIKE '%' || $${params.length} || '%' OR description ILIKE '%' || $${params.length} || '%')`)
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

    const orderClause = orderBy[sort] ?? "created_at DESC"
    const offset = (page - 1) * limit

    params.push(limit)
    params.push(offset)

    const products = await pool.query(`
        SELECT *
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
