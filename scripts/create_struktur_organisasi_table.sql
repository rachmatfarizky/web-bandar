-- Tabel untuk Struktur Organisasi Desa
CREATE TABLE IF NOT EXISTS struktur_organisasi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL COMMENT 'Jabatan atau posisi (misal: Kepala Desa)',
  name VARCHAR(100) NOT NULL COMMENT 'Nama lengkap pegawai',
  position VARCHAR(100) NOT NULL COMMENT 'Divisi atau bagian (misal: Pemerintahan Desa)',
  description TEXT COMMENT 'Deskripsi tugas dan tanggung jawab',
  icon VARCHAR(50) DEFAULT 'Shield' COMMENT 'Nama ikon dari Lucide React',
  color VARCHAR(50) DEFAULT 'emerald' COMMENT 'Warna tema (emerald, blue, rose, amber, purple, cyan, indigo, violet)',
  display_order INT DEFAULT 0 COMMENT 'Urutan tampil di halaman publik',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contoh data struktur organisasi Desa Bandar
INSERT INTO struktur_organisasi (title, name, position, description, icon, color, display_order) VALUES
('Kepala Desa', 'Budi Santoso', 'Pemerintahan Desa', 'Memimpin dan mengkoordinasikan seluruh kegiatan di desa', 'Shield', 'emerald', 1),
('Sekretaris Desa', 'Suryanto', 'Pemerintahan Desa', 'Menangani administrasi dan dokumentasi desa', 'Briefcase', 'blue', 2),
('Bendahara Desa', 'Siti Nurhaliza', 'Pemerintahan Desa', 'Mengelola keuangan dan anggaran desa', 'Heart', 'rose', 3),
('Kepala Dusun Bandar', 'Bambang Sutrisno', 'Kepala Dusun', 'Memimpin wilayah Dusun Bandar', 'Users', 'amber', 4),
('Kepala Dusun Sumber', 'Hartono', 'Kepala Dusun', 'Memimpin wilayah Dusun Sumber', 'Users', 'purple', 5),
('Kepala Dusun Mandar', 'Aji Widodo', 'Kepala Dusun', 'Memimpin wilayah Dusun Mandar', 'Users', 'cyan', 6);
