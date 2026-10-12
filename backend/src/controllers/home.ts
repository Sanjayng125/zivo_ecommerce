import { Context } from "hono"
import pool from "../db/client.js"
import redis from "../lib/redis.js"

export const getHomeSections = async (c: Context) => {
    const cached = await redis.get("home:sections")

    if (cached) {
        return c.json(cached)
    }

    const { rows: home_sections } = await pool.query(`
        SELECT *
        FROM home_sections
        WHERE is_active = true
        ORDER BY sort_order
        `)

    const productsOrderBy: Record<string, string> = {
        new_arrivals: "created_at DESC",
        best_sellers: "(rating_count * rating_avg) DESC",
        top_rated: "rating_avg DESC",
        trending: "(rating_count * rating_avg) / (EXTRACT(EPOCH FROM NOW() - created_at) / 86400 + 1) DESC"
    }

    const resolvedSections = await Promise.all(
        home_sections.map(async (section) => {
            let items: any[] = []

            if (section.type === "banner") {
                const { group_name } = section.config

                const banners = await pool.query(`
                    SELECT *
                    FROM banners
                    WHERE is_active = true AND group_name = $1
                    ORDER BY sort_order
                    `, [group_name])

                items = banners.rows
            }
            if (section.type === "category_row") {
                const { limit = 15, parent_id = null } = section.config

                const conditions = ["is_active = true"]
                const params: unknown[] = []

                if (parent_id) {
                    params.push(parent_id)
                    conditions.push(`parent_id = $${params.length}`)
                } else {
                    conditions.push(`parent_id IS NULL`)
                }

                const whereClause = conditions.join(" AND ")
                params.push(limit)

                const categories = await pool.query(`
                    SELECT *
                    FROM categories
                    WHERE ${whereClause}
                    ORDER BY sort_order
                    LIMIT $${params.length}
                    `, params)

                items = categories.rows
            }
            if (section.type === "product_row") {
                const { limit = 15, sort = "new_arrivals", category_id = null } = section.config

                const orderByClause = productsOrderBy[sort] ?? "created_at DESC"

                const conditions = ["is_active = true AND EXISTS (SELECT 1 FROM product_images WHERE product_id = products.id) AND EXISTS (SELECT 1 FROM product_variants WHERE product_id = products.id)"]
                const params: unknown[] = []

                if (category_id) {
                    params.push(category_id)
                    conditions.push(`category_id = $${params.length}`)
                }
                if (sort === "top_rated") {
                    params.push(20)
                    conditions.push(`rating_count >= $${params.length}`)
                }

                const whereClause = conditions.join(" AND ")
                params.push(limit)

                const { rows: products } = await pool.query(`
                    SELECT *
                    FROM products
                    WHERE ${whereClause}
                    ORDER BY ${orderByClause}
                    LIMIT $${params.length}
                    `, params)

                items = products
            }

            const { config, key, sort_order, ...sectionData } = section;

            return {
                ...sectionData,
                items,
            }
        })
    )

    await redis.set("home:sections", { home_sections: resolvedSections }, { ex: 3600 })

    return c.json({ home_sections: resolvedSections })
}
