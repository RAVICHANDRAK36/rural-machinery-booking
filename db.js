import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'dev.db');

let SQL = await initSqlJs();
let dbInstance = null;

if (fs.existsSync(dbPath)) {
  const filebuffer = fs.readFileSync(dbPath);
  dbInstance = new SQL.Database(filebuffer);
} else {
  dbInstance = new SQL.Database();
}

function saveDB() {
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export const db = {
  exec(sql) {
    dbInstance.exec(sql);
    saveDB();
  },
  prepare(sql) {
    return {
      get(...params) {
        const stmt = dbInstance.prepare(sql);
        stmt.bind(params);
        let result = null;
        if (stmt.step()) {
          result = stmt.getAsObject();
        }
        stmt.free();
        return result;
      },
      all(...params) {
        const stmt = dbInstance.prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
      run(...params) {
        dbInstance.run(sql, params);
        saveDB();
        const lastRes = dbInstance.exec("SELECT last_insert_rowid() as id");
        const lastInsertRowid = (lastRes[0] && lastRes[0].values[0] && lastRes[0].values[0][0]) || 0;
        return { lastInsertRowid };
      }
    };
  }
};

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      village TEXT NOT NULL,
      taluk TEXT NOT NULL,
      district TEXT NOT NULL,
      address TEXT,
      latitude REAL,
      longitude REAL,
      preferred_language TEXT DEFAULT 'en',
      profile_image TEXT,
      business_name TEXT,
      role TEXT NOT NULL CHECK(role IN ('FARMER', 'OWNER')),
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS machines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      registration_number TEXT NOT NULL,
      price_per_acre REAL NOT NULL,
      price_per_hour REAL NOT NULL,
      village TEXT NOT NULL,
      taluk TEXT,
      district TEXT,
      latitude REAL,
      longitude REAL,
      image_url TEXT,
      available INTEGER DEFAULT 1,
      maintenance_day INTEGER DEFAULT 0, -- 0=Sunday, 1=Monday, ..., 6=Saturday
      maintenance_enabled INTEGER DEFAULT 1,
      rating REAL DEFAULT 4.8,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_number TEXT UNIQUE NOT NULL,
      farmer_id INTEGER NOT NULL,
      machine_id INTEGER NOT NULL,
      booking_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      acres REAL NOT NULL,
      work_type TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED')),
      total_cost REAL NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(farmer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(machine_id) REFERENCES machines(id) ON DELETE CASCADE
    );
  `);
}

export default db;
