import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../db/client.js";

export const getCategories = async (c: Context) => {
    const page = Number(c.req.query("page") ?? 1)
    const limit = Number(c.req.query("limit") ?? 10)
    const sort = c.req.query("sort") ?? "newest"
    const q = c.req.query("q")?.trim()

    const conditions: string[] = ["c.is_active = true AND c.parent_id IS NULL"]
    const params: unknown[] = []

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

