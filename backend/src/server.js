import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { pool } from './db.js'

const app = express()
const port = 3001
const connectionTypes = ['Family', 'Coworker', 'Friend']
const statuses = ['Active', 'Pending', 'Inactive']

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/users', (async (request, response) => {
}))

app.get('/api/users/:id', (async (request, response) => {
}))

app.post('/api/users', (async (request, response) => {
}))

app.delete('/api/users/:id', (async (request, response) => {
}))


try {
  await pool.query('SELECT 1')
  app.listen(port, () => {
    console.log(`CashClever API listening at http://localhost:${port}`)
    console.log('PostgreSQL connection established')
  })
} catch (error) {
  console.error('Could not connect to PostgreSQL:', error.message)
  process.exitCode = 1
  await pool.end()
}
