import { pool } from './db.js'

const currentUser = {
  name: 'CashClever User',
  email: 'current.user@cashclever.local',
}

const connectedUsers = [
  {
    name: 'Avery Johnson',
    email: 'avery.johnson@example.com',
    connectiontype: 'Family',
    status: 'Active',
  },
  {
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    connectiontype: 'Family',
    status: 'Pending',
  },
  {
    name: 'Liam Chen',
    email: 'liam.chen@example.com',
    connectiontype: 'Family',
    status: 'Active',
  },
  {
    name: 'Sofia Martinez',
    email: 'sofia.martinez@example.com',
    connectiontype: 'Coworker',
    status: 'Inactive',
  },
  {
    name: 'Noah Williams',
    email: 'noah.williams@example.com',
    connectiontype: 'Coworker',
    status: 'Pending',
  },
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    connectiontype: 'Friend',
    status: 'Active',
  },
]

let client

try {
  client = await pool.connect()
  await client.query('BEGIN')

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(320) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await client.query(`
    ALTER TABLE users
    DROP COLUMN IF EXISTS status
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      connected_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      connection_type VARCHAR(20) NOT NULL
        CHECK (connection_type IN ('Family', 'Coworker', 'Friend')),
      status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Active', 'Pending', 'Inactive')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT connections_different_users
        CHECK (user_id <> connected_user_id),
      CONSTRAINT connections_unique_pair
        UNIQUE (user_id, connected_user_id)
    )
  `)

  await client.query(`
    ALTER TABLE connections
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'Pending'
      CHECK (status IN ('Active', 'Pending', 'Inactive'))
  `)

  const currentUserResult = await client.query(
    `INSERT INTO users (name, email)
     VALUES ($1, $2)
     ON CONFLICT (email)
     DO UPDATE SET
       name = EXCLUDED.name,
       updated_at = NOW()
     RETURNING id`,
    [currentUser.name, currentUser.email],
  )

  const currentUserId = currentUserResult.rows[0].id

  for (const user of connectedUsers) {
    const userResult = await client.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       ON CONFLICT (email)
       DO UPDATE SET
         name = EXCLUDED.name,
         updated_at = NOW()
       RETURNING id`,
      [user.name, user.email],
    )

    const connectedUserId = userResult.rows[0].id

    await client.query(
      `INSERT INTO connections (
         user_id,
         connected_user_id,
         connection_type,
         status
       )
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, connected_user_id)
       DO UPDATE SET
         connection_type = EXCLUDED.connection_type,
         status = EXCLUDED.status,
         updated_at = NOW()`,
      [currentUserId, connectedUserId, user.connectiontype, user.status],
    )
  }

  await client.query('COMMIT')
  console.log(`Seeded ${connectedUsers.length + 1} users and ${connectedUsers.length} connections`)
} catch (error) {
  if (client) {
    await client.query('ROLLBACK')
  }

  console.error('Could not seed the database:', error.message)
  process.exitCode = 1
} finally {
  client?.release()
  await pool.end()
}
