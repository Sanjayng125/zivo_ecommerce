import pg from 'pg'

const DB_URL = process.env.DATABASE_URL!

if (!DB_URL) {
    console.error("DB Config Failure")
    process.exit(1)
}

const { Pool } = pg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export default pool
