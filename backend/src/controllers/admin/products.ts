import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { DatabaseError } from "pg"
import slugify from "slugify"
import z from "zod"
import pool from "../../db/client.js"
import { customValidationHandler } from "../../lib/validator.js"

export const createProduct = async (c: Context) => {
    const { title, description, base_price, cover_image, category_id, is_active } = await c.req.json()

    const categoryResult = await pool.query(`
        SELECT id, slug
        FROM categories
        WHERE id = $1
        `, [category_id])

    if (!categoryResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Category not found" })
    }

    const slug = slugify(title, { lower: true, strict: true })

    try {
        const productResult = await pool.query(`
            INSERT INTO products (title, description, slug, base_price, cover_image, category_id, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `, [title, description, slug, base_price, cover_image, categoryResult.rows[0].id, is_active])

        if (!productResult.rowCount) {
            throw new HTTPException(500, { message: "Something went wrong while creating product" })
        }

        return c.json({ product: productResult.rows[0], message: "Product created" })
    } catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
            throw new HTTPException(409, { message: "Slug already exists" })
        }
        throw error
    }
}

export const getProducts = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 20)
    const sort = c.req.query("sort") ?? "newest"
    const category_id = c.req.query("category_id")
    const min_price = c.req.query("min_price")
    const max_price = c.req.query("max_price")
    const is_active = c.req.query("is_active")

    const conditions: string[] = []

    if (is_active === "false") {
        conditions.push("is_active = false")
    }
    else {
        conditions.push("is_active = true")
    }

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

export const updateProduct = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid product ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { title, description, base_price, cover_image, category_id } = await c.req.json()

    const columns: string[] = []
    const params: unknown[] = []

    if (title) {
        params.push(title)
        columns.push(`title = $${params.length}`)
        const slug = slugify(title, { lower: true, strict: true })
        params.push(slug)
        columns.push(`slug = $${params.length}`)
    }
    if (description) {
        params.push(description)
        columns.push(`description = $${params.length}`)
    }
    if (base_price) {
        params.push(base_price)
        columns.push(`base_price = $${params.length}`)
    }
    if (cover_image) {
        params.push(cover_image)
        columns.push(`cover_image = $${params.length}`)
    }
    if (category_id) {
        params.push(category_id)
        columns.push(`category_id = $${params.length}`)
    }

    if (columns.length === 0) {
        throw new HTTPException(400, { message: "Invalid data" })
    }

    const setClause = columns.join(", ")
    params.push(parsed.data)

    const productResult = await pool.query(`
        UPDATE products
        SET ${setClause}
        WHERE id = $${params.length}
        RETURNING *
        `, params)

    if (!productResult.rowCount) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    return c.json({ product: productResult.rows[0], message: "Product updated" })
}

export const toggleIsActive = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid product ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const productResult = await pool.query(`
        UPDATE products
        SET is_active = NOT is_active
        WHERE id = $1
        RETURNING *
        `, [parsed.data])

    if (!productResult.rowCount) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    return c.json({ product: productResult.rows[0], message: `Product ${productResult.rows[0].is_active ? "activated" : "deactivated"}` })
}

export const deleteProduct = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid product ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const productResult = await pool.query(`
        DELETE FROM products
        WHERE id = $1
        RETURNING id
        `, [parsed.data])

    if (!productResult.rowCount) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    return c.json({ message: "Product deleted" })
}
