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

                section["items"] = banners.rows
            }
            if (section.type === "category_row") {
                const categories = await pool.query(`
                    SELECT *
                    FROM categories
                    WHERE is_active = true
                    AND
                    parent_id IS NULL
                    ORDER BY sort_order
                    LIMIT 15
                    `)

                section["items"] = categories.rows
            }
            if (section.type === "product_row" && section.key === "trending") {
                const trending = await pool.query(`
                    SELECT *
                    FROM products
                    WHERE is_active = true
                    ORDER BY (rating_count * rating_avg) / (EXTRACT(EPOCH FROM NOW() - created_at) / 86400 + 1) DESC
                    LIMIT 15;
                    `)

                section["items"] = trending.rows
            }
            if (section.type === "product_row" && section.key === "new_arrivals") {
                const new_arrivals = await pool.query(`
                    SELECT *
                    FROM products
                    WHERE is_active = true
                    ORDER BY created_at DESC
                    LIMIT 15;
                    `)

                section["items"] = new_arrivals.rows
            }
            if (section.type === "product_row" && section.key === "best_sellers") {
                const best_sellers = await pool.query(`
                    SELECT *
                    FROM products
                    WHERE is_active = true
                    ORDER BY (rating_count * rating_avg) DESC
                    LIMIT 15;
                    `)

                section["items"] = best_sellers.rows
            }
            if (section.type === "product_row" && section.key === "top_rated") {
                const top_rated = await pool.query(`
                    SELECT *
                    FROM products
                    WHERE is_active = true AND rating_count >= 20
                    ORDER BY rating_avg DESC
                    LIMIT 15;
                    `)

                section["items"] = top_rated.rows
            }
        })
    )

    await redis.set("home:sections", { home_sections: home_sections }, { ex: 3600 })

    return c.json({ home_sections: home_sections })
}
