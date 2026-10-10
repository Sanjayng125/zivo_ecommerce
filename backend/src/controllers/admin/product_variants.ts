import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";
import z from "zod";
import pool from "../../db/client.js";
import { customValidationHandler } from "../../lib/validator.js";

export const getProductVariants = async (c: Context) => {
    const product_id = c.req.param("product_id")

    const productResult = await pool.query(`
        SELECT id FROM products WHERE id = $1
        `, [product_id])

    if (!productResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    const productVariants = await pool.query(`
        SELECT *
        FROM product_variants
        WHERE product_id = $1
        `, [product_id])

    return c.json({ productVariants: productVariants.rows })
}

export const createProductVariant = async (c: Context) => {
    const product_id = c.req.param("product_id")

    const { sku, size, color, price, stock } = await c.req.json()

    try {
        const productResult = await pool.query(`
        INSERT INTO product_variants (product_id, sku, size, color, price, stock)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `, [product_id, sku, size, color, Number(price), Number(stock)])

        if (!productResult.rowCount) {
            throw new HTTPException(500, { message: "Something went wrong while creating product variant" })
        }

        return c.json({ product_variant: productResult.rows[0], message: "Product variant created" })
    } catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
            throw new HTTPException(409, { message: "SKU already exists" })
        }
        throw error
    }
}

export const updateProductVariant = async (c: Context) => {
    const product_id = c.req.param("product_id")

    const parsed = z.uuid({ error: "Invalid product variant ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: variant_id } = parsed

    const { size, color, price } = await c.req.json()

    const columns: string[] = []
    const params: unknown[] = []

    if (size) {
        params.push(size)
        columns.push(`size = $${params.length}`)
    }
    if (color) {
        params.push(color)
        columns.push(`color = $${params.length}`)
    }
    if (price) {
        params.push(Number(price))
        columns.push(`price = $${params.length}`)
    }

    if (columns.length === 0) {
        throw new HTTPException(400, { message: "Invalid data" })
    }

    const setClause = columns.join(", ")

    const conditions: string[] = []

    params.push(variant_id)
    conditions.push(`id = $${params.length}`)

    params.push(product_id)
    conditions.push(`product_id = $${params.length}`)

    const whereClause = conditions.join(" AND ")

    const productVariantResult = await pool.query(`
        UPDATE product_variants
        SET ${setClause}
        WHERE ${whereClause}
        RETURNING *
        `, params)

    if (!productVariantResult.rowCount) {
        throw new HTTPException(404, { message: "Product variant not found" })
    }

    return c.json({ product_variant: productVariantResult.rows[0], message: "Product variant updated" })
}

export const updateProductVariantStock = async (c: Context) => {
    const product_id = c.req.param("product_id")

    const parsed = z.uuid({ error: "Invalid product variant ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: variant_id } = parsed

    const { stock } = await c.req.json()

    const productVariantResult = await pool.query(`
        UPDATE product_variants
        SET stock = $1
        WHERE id = $2 AND product_id = $3
        RETURNING *
        `, [Number(stock), variant_id, product_id])

    if (!productVariantResult.rowCount) {
        throw new HTTPException(404, { message: "Product variant not found" })
    }

    return c.json({ product_variant: productVariantResult.rows[0], message: "Product variant stock updated" })
}

export const deleteProductVariant = async (c: Context) => {
    const product_id = c.req.param("product_id")

    const parsed = z.uuid({ error: "Invalid product variant ID" }).safeParse(c.req.param("id"))

    if (!parsed.success) {
        customValidationHandler(parsed)
    }

    const { data: variant_id } = parsed

    const productVariantResult = await pool.query(`
        DELETE FROM product_variants
        WHERE id = $1 AND product_id = $2
        RETURNING id
        `, [variant_id, product_id])

    if (!productVariantResult.rowCount) {
        throw new HTTPException(404, { message: "Product variant not found" })
    }

    return c.json({ message: "Product variant deleted" })
}
