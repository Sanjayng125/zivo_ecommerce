import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import pool from "../db/client.js";
import { customValidationHandler } from "../lib/validator.js";

export const getAddresses = async (c: Context) => {
    const me = c.get("user")

    const addressesResult = await pool.query(`
        SELECT * FROM addresses
        WHERE user_id = $1
        `, [me.id])

    return c.json({ addresses: addressesResult.rows ?? [] })
}

export const addAddress = async (c: Context) => {
    const me = c.get("user")

    const { full_name, phone, line1, line2 = null, city, state, pincode, is_default = false } = await c.req.json()

    if (is_default) {
        await pool.query(`
            UPDATE addresses
            SET is_default = false
            WHERE user_id = $1
            RETURNING id
            `, [me.id])
    }

    const addResult = await pool.query(`
            INSERT INTO addresses (user_id, full_name, phone, line1, line2, city, state, pincode, is_default)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
            `, [me.id, full_name, phone, line1, line2, city, state, pincode, is_default])

    if (!addResult.rowCount) {
        throw new HTTPException(400, { message: "Failed to add address" })
    }

    return c.json({ new_address: addResult.rows[0], message: "New Address Added" }, 201)
}

export const updateAddress = async (c: Context) => {
    const address_id = z.uuid().safeParse(c.req.param("address_id"))

    if (!address_id.success) {
        customValidationHandler(address_id)
    }

    const me = c.get("user")

    const { full_name, phone, line1, line2 = null, city, state, pincode, is_default = false } = await c.req.json()

    if (is_default) {
        await pool.query(`
            UPDATE addresses
            SET is_default = false
            WHERE user_id = $1
            RETURNING id
            `, [me.id])
    }

    const updateResult = await pool.query(`
            UPDATE addresses
            SET
            full_name = $1,
            phone = $2,
            line1 = $3,
            line2 = $4,
            city = $5,
            state = $6,
            pincode = $7,
            is_default = $8
            WHERE user_id = $9 AND id = $10
            RETURNING *
            `, [full_name, phone, line1, line2, city, state, pincode, is_default, me.id, address_id.data])

    if (!updateResult.rowCount) {
        throw new HTTPException(404, { message: "Address not found" })
    }

    return c.json({ updated_address: updateResult.rows[0], message: "Address Updated" })
}

export const deleteAddress = async (c: Context) => {
    const address_id = z.uuid().safeParse(c.req.param("address_id"))

    if (!address_id.success) {
        customValidationHandler(address_id)
    }

    const me = c.get("user")

    const deleteResult = await pool.query(`
        DELETE FROM addresses
        WHERE user_id = $1 AND id = $2
        RETURNING id
        `, [me.id, address_id.data])

    if (!deleteResult.rowCount) {
        throw new HTTPException(404, { message: "Address not found" })
    }

    return c.json({ message: "Address Deleted" })
}
