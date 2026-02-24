import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { join } from 'path'
import { mkdirSync } from 'fs'

const dataDir = join(process.cwd(), 'data')
mkdirSync(dataDir, { recursive: true })

const sqlite = new Database(join(dataDir, 'tuesday.db'))

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })
export { schema }
