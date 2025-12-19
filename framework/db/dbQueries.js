import { dbQuery } from './dbClient.js'

export async function findUserByEmail(email) {
  return dbQuery(
    `SELECT id, username, email, role, created_at
     FROM users
     WHERE email = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [email]
  )
}
