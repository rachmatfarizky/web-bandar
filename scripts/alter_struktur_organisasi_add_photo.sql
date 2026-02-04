-- Tambah column photo_url ke tabel struktur_organisasi
ALTER TABLE struktur_organisasi 
ADD COLUMN photo_url VARCHAR(500) AFTER color COMMENT 'URL foto profil pegawai';

-- Alternatif jika column sudah ada:
-- ALTER TABLE struktur_organisasi MODIFY COLUMN photo_url VARCHAR(500);
