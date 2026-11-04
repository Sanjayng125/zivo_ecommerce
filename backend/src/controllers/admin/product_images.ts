import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import pool from "../../db/client.js";
import redis from "../../lib/redis.js";
import { ProductImage } from "../../schemas/product_images.js";
import { deleteImage } from "../../services/imagekit.js";

export const getProductImages = async (c: Context) => {
    const product_id = c.req.param("product_id")

    const productImagesResult = await pool.query(`
        SELECT *
        FROM product_images
        WHERE product_id = $1
        ORDER BY sort_order
        `, [product_id])

    return c.json({ productImages: productImagesResult.rows })
}

export const createProductImage = async (c: Context) => {
    const product_id = c.req.param("product_id")

    const { url, file_id, sort_order = 0 } = await c.req.json()

    const productResult = await pool.query(`
        SELECT id
        FROM products
        WHERE id = $1
        `, [product_id])

    if (!productResult.rows?.[0]) {
        throw new HTTPException(404, { message: "Product not found" })
    }

    const productImagesResult = await pool.query(`
        INSERT INTO product_images (product_id, url, file_id, sort_order)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `, [product_id, url, file_id, sort_order])

    if (!productImagesResult.rowCount) {
        throw new HTTPException(400, { message: "Failed to create product image" })
    }

    await redis.del(`product:${productResult.rows[0].slug}`)

    return c.json({ productImage: productImagesResult.rows[0], message: "Product image created" })
}

export const reorderProductImages = async (c: Context) => {
    const product_id = c.req.param("product_id")

    const { new_sort_order } = await c.req.json()

    const ids = new_sort_order.map((item: ProductImage) => item.product_image_id)
    const sort_orders = new_sort_order.map((item: ProductImage) => item.sort_order)

    if (ids.length !== sort_orders.length || ids.length === 0) {
        throw new HTTPException(400, { message: "Invalid data" })
    }

    const productImagesResult = await pool.query(`
        UPDATE product_images pimg
        SET sort_order = nd.sort_order
        FROM (SELECT unnest($1::uuid[]) AS product_image_id, unnest($2::integer[]) AS sort_order) AS nd
        WHERE pimg.product_id = $3 AND pimg.id = nd.product_image_id
        RETURNING *
        `, [ids, sort_orders, product_id])

    if (!productImagesResult.rowCount) {
        throw new HTTPException(404, { message: "Product image not found" })
    }

    return c.json({ message: "Product images reordered" })
}

export const updateProductImage = async (c: Context) => {
    const product_id = c.req.param("product_id")
    const product_image_id = c.req.param("product_image_id")

    const { url, file_id, sort_order } = await c.req.json()

    const oldImageFileIdResult = await pool.query(`
        SELECT file_id
        FROM product_images
        WHERE id = $1 AND product_id = $2
        `, [product_image_id, product_id])
    const oldImageFileId = oldImageFileIdResult.rows?.[0]?.file_id

    const columns: string[] = []
    const params: unknown[] = []

    if (url && file_id) {
        params.push(url)
        columns.push(`url = $${params.length}`)
        params.push(file_id)
        columns.push(`file_id = $${params.length}`)
    }
    if (sort_order !== undefined) {
        params.push(sort_order)
        columns.push(`sort_order = $${params.length}`)
    }

    if (columns.length === 0) {
        throw new HTTPException(400, { message: "Invalid data" })
    }

    const setClause = columns.join(", ")
    params.push(product_id)
    params.push(product_image_id)

    const productResult = await pool.query(`SELECT slug FROM products WHERE id = $1`, [product_id])

    const productImagesResult = await pool.query(`
        UPDATE product_images
        SET ${setClause}
        WHERE product_id = $${params.length - 1} AND id = $${params.length}
        RETURNING *
        `, params)

    if (!productImagesResult.rowCount) {
        throw new HTTPException(404, { message: "Product image not found" })
    }

    await redis.del(`product:${productResult.rows[0].slug}`)

    if (oldImageFileId) await deleteImage(oldImageFileId)

    return c.json({ productImage: productImagesResult.rows[0], message: "Product image updated" })
}

export const deleteProductImage = async (c: Context) => {
    const product_id = c.req.param("product_id")
    const product_image_id = c.req.param("product_image_id")

    const productResult = await pool.query(`SELECT slug FROM products WHERE id = $1`, [product_id])

    const productImagesResult = await pool.query(`
        DELETE FROM product_images
        WHERE product_id = $1 AND id = $2
        RETURNING *
        `, [product_id, product_image_id])

    if (!productImagesResult.rowCount) {
        throw new HTTPException(404, { message: "Product image not found" })
    }

    await redis.del(`product:${productResult.rows[0].slug}`)

    const imageFileId = productImagesResult.rows?.[0]?.file_id
    if (imageFileId) await deleteImage(imageFileId)

    return c.json({ message: "Product image deleted" })
}
