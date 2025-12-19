// framework/db/dbClient.js
import '../utils/env.js'
import pg from 'pg'

const { Pool } = pg

// Keep this as the single guard for "should DB be allowed at all?"
function mustAllowDbTests() {
  if (process.env.ALLOW_DB_TESTS !== 'true') {
    throw new Error('DB tests are disabled. Set ALLOW_DB_TESTS=true to enable.')
  }
  if (process.env.ENV === 'prod') {
    throw new Error('Refusing to run DB tests against prod.')
  }
}

// Lazy-initialized pool so importing this module never throws
let _pool = null

function getPool() {
  // Only enforce the guard when we actually try to use the DB
  mustAllowDbTests()

  if (_pool) return _pool

  _pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 5,
    idleTimeoutMillis: 10_000,
  })

  return _pool
}

// Optional: export db for callers that need direct Pool access
export function db() {
  return getPool()
}

export async function dbQuery(text, params = []) {
  const pool = getPool()
  return pool.query(text, params)
}

export async function dbClose() {
  // If DB tests are disabled, treat close as a no-op (prevents teardown failures)
  if (process.env.ALLOW_DB_TESTS !== 'true') return

  // Still refuse prod even on close, just to be safe
  if (process.env.ENV === 'prod') return

  if (_pool) {
    await _pool.end()
    _pool = null
  }
}
