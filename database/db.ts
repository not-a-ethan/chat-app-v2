import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();
export const db: any = new sqlite.Database('./app/database/db.db');