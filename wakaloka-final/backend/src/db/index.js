import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { seed } from './seed.js';

export function openDb(file) {
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON'); // SQLite mematikannya secara bawaan
  db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  seed(db);
  return db;
}
