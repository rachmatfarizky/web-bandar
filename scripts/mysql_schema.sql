-- Struktur tabel MySQL hasil migrasi dari Supabase


-- Tabel artikel
CREATE TABLE IF NOT EXISTS artikel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  image VARCHAR(255),
  dusun_id INT,
  authors TEXT, -- JSON array of admin IDs
  author VARCHAR(100), -- legacy
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (dusun_id) REFERENCES dusun(id)
);

-- Tabel dusun
CREATE TABLE IF NOT EXISTS dusun (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Tabel users (jika ada)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel lainnya bisa ditambah sesuai kebutuhan
