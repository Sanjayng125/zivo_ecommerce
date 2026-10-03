import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";

export const getCategories = async (c: Context) => {
    const active_categories = await pool.query(`
        SELECT
        c.*,
        COALESCE(
            jsonb_agg(to_jsonb(sc)) FILTER (WHERE sc.id IS NOT NULL),
            '[]'::jsonb
        ) AS subcategories
        FROM categories c
        LEFT JOIN categories sc
            ON c.id = sc.parent_id
        WHERE c.is_active = true
        AND c.parent_id IS NULL
        GROUP BY c.id
        ORDER BY c.sort_order;
    `)

    return c.json({ active_categories: active_categories.rows ?? [] })
}

export const getCategory = async (c: Context) => {
    const slug = c.req.param("slug")

    const category = await pool.query(`
        SELECT
        c.*,
        COALESCE(
            jsonb_agg(to_jsonb(sc)) FILTER (WHERE sc.id IS NOT NULL),
            '[]'::jsonb
        ) AS subcategories
        FROM categories c
        LEFT JOIN categories sc
            ON c.id = sc.parent_id
        WHERE
        c.slug = $1
        AND
        c.is_active = true
        AND c.parent_id IS NULL
        GROUP BY c.id
    `, [slug])

    if (!category.rows?.[0]) {
        throw new HTTPException(404, { message: "Category not found" })
    }

    return c.json({ category: category.rows[0] })
}

