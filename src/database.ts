import sqlite from 'sqlite3'
import path from 'path'

let database: sqlite.Database | undefined

export function connectToDatabase(callback: (err: Error | null) => void) {
  database = new sqlite.Database(
    path.resolve(__dirname, '../data/database.db'),
    callback
  )
}

export default function getDatabase() {
  return database
}
