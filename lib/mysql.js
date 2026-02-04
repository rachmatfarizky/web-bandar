// lib/mysql.js
import mysql from 'mysql2/promise';

// KONFIGURASI MYSQL
// Pastikan user, password, dan database sesuai dengan setting MySQL lokal Anda
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'website_bandar', // Ganti dengan nama database Anda
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
