import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import pool from "../../db/client.js";
import { customValidationHandler } from "../../lib/validator.js";

export const getBanners = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 10)
    const sort = c.req.query("sort") ?? "newest"
    const is_active = c.req.query("is_active")

    let conditions: string[] = ["TRUE"]
    const params: unknown[] = []

    if (is_active !== undefined) {
        params.push(is_active)
        conditions.push(`is_active = $${params.length}`)
    }

    const orderBy: Record<string, string> = {
        newest: "created_at DESC",
        oldest: "created_at ASC",
        sort_order_asc: "sort_order ASC",
        sort_order_desc: "sort_order DESC",
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await pool.query(`SELECT COUNT(*) FROM banners WHERE ${whereClause}`, params);
    const total = Number(countResult.rows[0].count);

    const orderClause = orderBy[sort] ?? "created_at DESC";
    const offset = (page - 1) * limit;

    params.push(limit);
    params.push(offset);

    const banners = await pool.query(`
        SELECT *
        FROM banners
        WHERE ${whereClause}
        ORDER BY ${orderClause}
        LIMIT $${params.length - 1}
        OFFSET $${params.length}`,
        params
    );

    return c.json({
        banners: banners.rows ?? [],
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    })
}

export const createBanner = async (c: Context) => {
    const { image_url, link, sort_order, is_active } = await c.req.json()

    const columns: string[] = ["image_url"]
    const values: string[] = ["$1"]
    const params: unknown[] = [image_url]

    if (link) {
        columns.push("link")
        params.push(link)
        values.push(`$${params.length}`)
    }
    if (sort_order !== undefined) {
        columns.push("sort_order")
        params.push(sort_order)
        values.push(`$${params.length}`)
    }
    if (is_active) {
        columns.push("is_active")
        params.push(is_active)
        values.push(`$${params.length}`)
    }

    const allColumns = `(${columns.join(", ")})`
    const allValues = `(${values.join(", ")})`

    const bannerResult = await pool.query(`
        INSERT INTO banners ${allColumns}
        VALUES ${allValues}
        RETURNING *
        `, params)

    if (!bannerResult.rowCount) {
        throw new HTTPException(500, { message: "Something went wrong while creating banner" })
    }

    return c.json({ banner: bannerResult.rows[0], message: "Banner created" })
}

export const updateBanner = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid banner ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: banner_id } = parsed

    const { image_url, link, sort_order } = await c.req.json()

    const columns: string[] = []
    const params: unknown[] = []

    if (image_url) {
        params.push(image_url)
        columns.push(`image_url = $${params.length}`)
    }
    if (link) {
        params.push(link)
        columns.push(`link = $${params.length}`)
    }
    if (sort_order !== undefined) {
        params.push(sort_order)
        columns.push(`sort_order = $${params.length}`)
    }

    if (columns.length === 0) {
        throw new HTTPException(400, { message: "Invalid data" })
    }

    const setClause = columns.join(", ")
    params.push(banner_id)

    const bannerResult = await pool.query(`
        UPDATE banners
        SET ${setClause}
        WHERE id = $${params.length}
        RETURNING *
        `, params)

    if (!bannerResult.rowCount) {
        throw new HTTPException(404, { message: "Banner not found" })
    }

    return c.json({ banner: bannerResult.rows[0], message: "Banner updated" })
}

export const toggleIsActive = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid banner ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: banner_id } = parsed

    const bannerResult = await pool.query(`
        UPDATE banners
        SET is_active = NOT is_active
        WHERE id = $1
        RETURNING *
        `, [banner_id])

    if (!bannerResult.rowCount) {
        throw new HTTPException(404, { message: "Banner not found" })
    }

    return c.json({ banner: bannerResult.rows[0], message: `Banner ${bannerResult.rows[0].is_active ? "activated" : "deactivated"}` })
}

export const deleteBanner = async (c: Context) => {
    const parsed = z.uuid({ error: "Invalid banner ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: banner_id } = parsed

    const bannerResult = await pool.query(`
        DELETE FROM banners
        WHERE id = $1
        RETURNING id
        `, [banner_id])

    if (!bannerResult.rowCount) {
        throw new HTTPException(404, { message: "Banner not found" })
    }

    return c.json({ message: "Banner deleted" })
}
