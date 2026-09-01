import 'dotenv/config'
import pg from 'pg'

console.log(process.env.DATABASE_URL)
const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})