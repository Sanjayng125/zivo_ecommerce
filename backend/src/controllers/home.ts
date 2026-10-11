import { Context } from "hono"
import pool from "../db/client.js"
import redis from "../lib/redis.js"

export const getHomeSections = async (c: Context) => {

    const cached = await redis.get("home:sections")

    if (cached) {
        return c.json({ home_sections: cached })
    }

    const res = await pool.query(`
        SELECT *
        FROM home_sections
        WHERE is_active = true
        ORDER BY sort_order
        `)

    const home_sections = res.rows

    await Promise.all(
        home_sections.map(async (section) => {
            if (section.type === "banner") {
                const banners = await pool.query(`
                    SELECT *
                    FROM banners
                    WHERE is_active = true
                    ORDER BY sort_order
                    `)

                section["banners"] = banners.rows
            }
            if (section.type === "category_row") {
                const categories = await pool.query(`
                    SELECT *
                    FROM categories
                    WHERE is_active = true
                    AND
                    parent_id IS NULL
                    ORDER BY sort_order
                    `)

                section["categories"] = categories.rows
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

    await redis.set("home:sections", { home_sections: home_sections }, { ex: 3600 })

    return c.json({ home_sections: home_sections })
}
