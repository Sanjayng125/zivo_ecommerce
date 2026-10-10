import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import z from "zod"
import pool from "../db/client.js"
import { customValidationHandler } from "../lib/validator.js"

export const getHomeSections = async (c: Context) => {
    const res = await pool.query(`
        SELECT *
        FROM home_sections
        WHERE is_active = true
        ORDER BY sort_order
        `)

    const active_home_sections = res.rows

    await Promise.all(
        active_home_sections.map(async (section) => {
            if (section.type === "banner") {
                const active_banners = await pool.query(`
                    SELECT *
                    FROM banners
                    WHERE is_active = true
                    ORDER BY sort_order
                    `)

                section["active_banners"] = active_banners.rows
            }
            if (section.type === "category_row") {
                const active_categories = await pool.query(`
                    SELECT *
                    FROM categories
                    WHERE is_active = true
                    AND
                    parent_id IS NULL
                    ORDER BY sort_order
                    `)

                section["active_categories"] = active_categories.rows
            }
            if (section.type === "product_row" && section.key === "new_arrivals") {
                const new_arrivals = await pool.query(`
                    SELECT *
                    FROM products
                    WHERE is_active = true
                    ORDER BY created_at DESC
                    LIMIT 15;
                    `)

                section["new_arrivals"] = new_arrivals.rows
            }
            if (section.type === "product_row" && section.key === "best_sellers") {
                const best_sellers = await pool.query(`
                    SELECT *
                    FROM products
                    WHERE is_active = true
                    ORDER BY rating_count DESC
                    LIMIT 15;
                    `)

                section["best_sellers"] = best_sellers.rows
            }
        })
    )

    return c.json({ active_home_sections: active_home_sections })
}

export const getAdminHomeSections = async (c: Context) => {
    const { is_active, sort } = c.req.query()

    const orderBy: Record<string, string> = {
        newest: "sort_order DESC",
        oldest: "sort_order ASC",
        sort_order_asc: "sort_order ASC",
        sort_order_desc: "sort_order DESC",
    }

    let whereClause = "TRUE"
    const params: unknown[] = []
    if (is_active !== undefined) {
        params.push(is_active)
        whereClause = `is_active = $${params.length}`
    }
    const orderClause = orderBy[sort] ?? "sort_order DESC"

    const res = await pool.query(`
        SELECT *
        FROM home_sections
        WHERE ${whereClause}
        ORDER BY ${orderClause}
        `)

    return c.json({ active_home_sections: res.rows })
}

export const updateHomeSection = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid home section ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: home_section_id } = parsed

    const { title, sort_order } = await c.req.json()

    const columns: string[] = []
    const values: string[] = []
    const params: unknown[] = []

    if (title) {
        params.push(title)
        columns.push(`title = $${params.length}`)
    }
    if (sort_order !== undefined) {
        params.push(sort_order)
        columns.push(`sort_order = $${params.length}`)
    }

    if (columns.length === 0) {
        throw new HTTPException(400, { message: "Invalid data" })
    }

    const setClause = columns.join(", ")

    params.push(home_section_id)

    const homeSectionResult = await pool.query(`
        UPDATE home_sections
        SET ${setClause}
        WHERE id = $${params.length}
        RETURNING *
        `, params)

    if (!homeSectionResult.rowCount) {
        throw new HTTPException(404, { message: "Home section not found" })
    }

    return c.json({ home_section: homeSectionResult.rows[0], message: "Home section updated" })
}

export const toggleIsActive = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid home section ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: home_section_id } = parsed

    const homeSectionResult = await pool.query(`
        UPDATE home_sections
        SET is_active = NOT is_active
        WHERE id = $1
        RETURNING *
        `, [home_section_id])

    if (!homeSectionResult.rowCount) {
        throw new HTTPException(404, { message: "Home section not found" })
    }

    return c.json({ home_section: homeSectionResult.rows[0], message: `Home section ${homeSectionResult.rows[0].is_active ? "activated" : "deactivated"}` })
}
