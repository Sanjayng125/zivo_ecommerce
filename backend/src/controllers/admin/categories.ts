import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { DatabaseError } from "pg"
import slugify from "slugify"
import z from "zod"
import pool from "../../db/client.js"
import { customValidationHandler } from "../../lib/validator.js"

export const getCategories = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 10)
    const sort = c.req.query("sort") ?? "newest"
    const is_active = c.req.query("is_active")
    const q = c.req.query("q")?.trim()

    const conditions: string[] = ["c.parent_id IS NULL"]
    const params: unknown[] = []

    if (is_active !== undefined) {
        params.push(is_active)
        conditions.push(`c.is_active = $${params.length}`)
    }
    if (q) {
        params.push(`%${q}%`)
        conditions.push(`c.name LIKE $${params.length}`)
    }

    const orderBy: Record<string, string> = {
        newest: "c.created_at DESC",
        oldest: "c.created_at ASC",
        sort_order_asc: "c.sort_order ASC",
        sort_order_desc: "c.sort_order DESC",
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await pool.query(`SELECT COUNT(*) FROM categories c WHERE ${whereClause}`, params);
    const total = Number(countResult.rows[0].count);

    const orderClause = orderBy[sort] ?? "c.created_at DESC";
    const offset = (page - 1) * limit;

    params.push(limit);
    params.push(offset);

    const categories = await pool.query(`
        SELECT
        c.*,
        COALESCE(
            jsonb_agg(to_jsonb(sc)) FILTER (WHERE sc.id IS NOT NULL),
            '[]'::jsonb
        ) AS subcategories
        FROM categories c
        LEFT JOIN categories sc
            ON c.id = sc.parent_id
        WHERE ${whereClause}
        GROUP BY c.id
        ORDER BY ${orderClause}
        LIMIT $${params.length - 1}
        OFFSET $${params.length}`,
        params
    );

    return c.json({
        categories: categories.rows ?? [],
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    })
}

export const createCategory = async (c: Context) => {
    const { name, parent_id, image_url, sort_order, is_active } = await c.req.json()

    const slug = slugify(name, { lower: true, strict: true })

    const colomns: string[] = ["name", "slug"]
    const values: string[] = ["$1", "$2"]
    const params: unknown[] = [name, slug]

    if (parent_id) {
        const isParentResult = await pool.query(`
            SELECT id, parent_id FROM categories WHERE id = $1
            `, [parent_id])

        if (!isParentResult.rows?.[0]) {
            throw new HTTPException(404, { message: "Parent category not found" })
        }

        if (isParentResult.rows?.[0].parent_id) {
            throw new HTTPException(400, { message: "Cannot nest categories more than 2 levels deep" })
        }

        colomns.push("parent_id")
        params.push(parent_id)
        values.push(`$${params.length}`)
    }
    if (image_url) {
        colomns.push("image_url")
        params.push(image_url)
        values.push(`$${params.length}`)
    }
    if (sort_order !== undefined) {
        colomns.push("sort_order")
        params.push(sort_order)
        values.push(`$${params.length}`)
    }
    if (is_active) {
        colomns.push("is_active")
        params.push(is_active)
        values.push(`$${params.length}`)
    }

    try {
        const allColumns = `(${colomns.join(", ")})`
        const allValues = `(${values.join(", ")})`

        const categoryResult = await pool.query(`
        INSERT INTO categories ${allColumns}
        VALUES ${allValues}
        RETURNING *
        `, params)

        if (!categoryResult.rowCount) {
            throw new HTTPException(500, { message: "Something went wrong while creating category" })
        }

        return c.json({ category: categoryResult.rows[0], message: "Category created" })
    } catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
            throw new HTTPException(409, { message: "Slug already exists" })
        }
        throw error
    }
}

export const updateCategory = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid category ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: category_id } = parsed

    const { name, parent_id, image_url, sort_order } = await c.req.json()

    const columns: string[] = []
    const params: unknown[] = []

    if (name) {
        params.push(name)
        columns.push(`name = $${params.length}`)
        const slug = slugify(name, { lower: true, strict: true })
        params.push(slug)
        columns.push(`slug = $${params.length}`)
    }
    if (parent_id) {
        params.push(parent_id)
        columns.push(`parent_id = $${params.length}`)
    }
    if (image_url) {
        params.push(image_url)
        columns.push(`image_url = $${params.length}`)
    }
    if (sort_order !== undefined) {
        params.push(sort_order)
        columns.push(`sort_order = $${params.length}`)
    }

    if (columns.length === 0) {
        throw new HTTPException(400, { message: "Invalid data" })
    }

    const setClause = columns.join(", ")
    params.push(category_id)

    try {
        const categoryResult = await pool.query(`
        UPDATE categories
        SET ${setClause}
        WHERE id = $${params.length}
        RETURNING *
        `, params)

        if (!categoryResult.rowCount) {
            throw new HTTPException(404, { message: "Category not found" })
        }

        return c.json({ category: categoryResult.rows[0], message: "Category updated" })
    } catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
            throw new HTTPException(409, { message: "Slug already exists" })
        }
        throw error
    }
}

export const toggleIsActive = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid category ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: category_id } = parsed

    const categoryResult = await pool.query(`
        UPDATE categories
        SET is_active = NOT is_active
        WHERE id = $1
        RETURNING *
        `, [category_id])

    if (!categoryResult.rowCount) {
        throw new HTTPException(404, { message: "Category not found" })
    }

    return c.json({ category: categoryResult.rows[0], message: `Category ${categoryResult.rows[0].is_active ? "activated" : "deactivated"}` })
}

export const deleteCategory = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid category ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: category_id } = parsed

    try {
        const categoryResult = await pool.query(`
        DELETE FROM categories
        WHERE id = $1
        RETURNING id
        `, [category_id])

        if (!categoryResult.rowCount) {
            throw new HTTPException(404, { message: "Category not found" })
        }

        return c.json({ message: "Category deleted" })
    } catch (error) {
        if (error instanceof DatabaseError && error.code === "23503") {
            throw new HTTPException(409, { message: "Category has products, reassign them first" })
        }
        throw error
    }
}
