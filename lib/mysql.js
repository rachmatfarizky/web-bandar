import mysql from 'mysql2/promise';

// KONFIGURASI MYSQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'website_bandar',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
