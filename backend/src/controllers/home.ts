import { Context } from "hono"
import pool from "../db/client.js"

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
