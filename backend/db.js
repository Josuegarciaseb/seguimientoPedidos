// backend/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

// ✅ Crear y exportar un único pool de conexión global
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;

