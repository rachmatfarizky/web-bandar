# Implementasi Struktur Organisasi Desa - Database

## Ringkasan
Sistem Struktur Organisasi telah diintegrasikan dengan database MySQL untuk penyimpanan data jangka panjang. Admin dapat melakukan CRUD (Create, Read, Update, Delete) melalui halaman admin.

## Struktur Database

### Tabel: `struktur_organisasi`
```sql
CREATE TABLE struktur_organisasi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,          -- Jabatan/Posisi
  name VARCHAR(100) NOT NULL,           -- Nama Lengkap
  position VARCHAR(100) NOT NULL,       -- Divisi/Bagian
  description TEXT,                      -- Deskripsi Tugas
  icon VARCHAR(50) DEFAULT 'Shield',    -- Ikon Lucide React
  color VARCHAR(50) DEFAULT 'emerald',  -- Warna Tema
  display_order INT DEFAULT 0,          -- Urutan Tampil
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Field Penjelasan:
- **id**: Identifier unik
- **title**: Jabatan atau posisi (e.g., "Kepala Desa", "Sekretaris Desa")
- **name**: Nama lengkap pegawai
- **position**: Divisi atau bagian (e.g., "Pemerintahan Desa", "Kepala Dusun")
- **description**: Deskripsi tugas dan tanggung jawab
- **icon**: Nama ikon dari Lucide React (Shield, Briefcase, Heart, Users, Zap, Award, Target, Compass)
- **color**: Warna tema (emerald, blue, rose, amber, purple, cyan, indigo, violet)
- **display_order**: Urutan tampil (default 1-6 untuk urutan kepemimpinan)

## Setup Database

### 1. Jalankan SQL Script
```bash
# Gunakan MySQL client
mysql -u [username] -p [database] < scripts/create_struktur_organisasi_table.sql
```

Atau jalankan query langsung di MySQL:
```sql
-- Copy & paste isi file scripts/create_struktur_organisasi_table.sql
```

### 2. Verifikasi Tabel
```sql
SHOW TABLES LIKE 'struktur_organisasi';
SELECT * FROM struktur_organisasi;
```

## API Endpoints

### GET /api/struktur-organisasi
Fetch semua struktur organisasi
```bash
curl http://localhost:3000/api/struktur-organisasi
```

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Kepala Desa",
      "name": "Budi Santoso",
      "position": "Pemerintahan Desa",
      "description": "Memimpin dan mengkoordinasikan...",
      "icon": "Shield",
      "color": "emerald",
      "display_order": 1
    },
    ...
  ]
}
```

### POST /api/struktur-organisasi
Create struktur baru
```bash
curl -X POST http://localhost:3000/api/struktur-organisasi \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kepala Dusun Mandar",
    "name": "Aji Widodo",
    "position": "Kepala Dusun",
    "description": "Memimpin wilayah Dusun Mandar",
    "icon": "Users",
    "color": "cyan",
    "display_order": 6
  }'
```

### PUT /api/struktur-organisasi
Update struktur
```bash
curl -X PUT http://localhost:3000/api/struktur-organisasi \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "title": "Kepala Desa",
    "name": "Budi Santoso",
    "position": "Pemerintahan Desa",
    "description": "Memimpin dan mengkoordinasikan...",
    "icon": "Shield",
    "color": "emerald",
    "display_order": 1
  }'
```

### DELETE /api/struktur-organisasi?id=1
Delete struktur
```bash
curl -X DELETE http://localhost:3000/api/struktur-organisasi?id=1
```

## Admin Interface

### Akses Halaman Admin
1. Login ke admin panel
2. Dashboard → Klik tombol "Struktur Organisasi"
3. Atau akses langsung: `/admin/struktur-organisasi`

### Fitur CRUD

#### Create (Tambah)
1. Klik tombol "Tambah Struktur"
2. Isi form:
   - Jabatan/Posisi
   - Nama Lengkap
   - Posisi/Divisi
   - Deskripsi
   - Pilih Ikon
   - Pilih Warna
   - Urutan Tampil
3. Klik "Tambahkan"

#### Read (Lihat)
- Tabel menampilkan semua struktur organisasi
- Diurutkan berdasarkan `display_order`

#### Update (Edit)
1. Klik tombol Edit (ikon pensil)
2. Form akan terisi dengan data existing
3. Ubah data yang diperlukan
4. Klik "Perbarui"

#### Delete (Hapus)
1. Klik tombol Delete (ikon trash)
2. Konfirmasi penghapusan
3. Data akan dihapus dari database

## Frontend Integration

### Halaman Publik: `/struktur-organisasi`
- Fetch data dari `/api/struktur-organisasi`
- Menampilkan semua struktur dengan styling berdasarkan `color`
- Responsive design untuk mobile & desktop
- Includes sidebar info dan footer

### Dinamis Rendering
Data ditampilkan berdasarkan urutan `display_order`:
```javascript
const [strStructure, setStrStructure] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/struktur-organisasi');
    const result = await response.json();
    setStrStructure(result.data);
  };
  fetchData();
}, []);
```

## Icon Options
Pilihan ikon yang tersedia:
- Shield (Perisai - untuk kepala desa)
- Briefcase (Tas - untuk sekretaris)
- Heart (Hati - untuk bendahara)
- Users (Pengguna - untuk kepala dusun)
- Zap (Kilat - untuk energi/perubahan)
- Award (Penghargaan - untuk prestasi)
- Target (Target - untuk misi)
- Compass (Kompas - untuk navigasi)

## Color Options
Pilihan warna tema:
- emerald (Hijau/Primary)
- blue (Biru)
- rose (Merah Muda)
- amber (Kuning/Oranye)
- purple (Ungu)
- cyan (Sian)
- indigo (Indigo)
- violet (Ungu Tua)

## Data Persistence
✅ Data tersimpan di database MySQL
✅ Tidak hilang meski server restart
✅ Scalable untuk penambahan struktur baru
✅ Support untuk perubahan nama/posisi kapan saja

## Maintenance

### Backup Database
```bash
mysqldump -u [username] -p [database] struktur_organisasi > backup_struktur.sql
```

### Update Data Massal
```sql
UPDATE struktur_organisasi SET color = 'blue' WHERE id > 3;
```

### Hapus Semua Data
```sql
DELETE FROM struktur_organisasi;
TRUNCATE TABLE struktur_organisasi;
```

## Troubleshooting

### Data tidak muncul di frontend
1. Pastikan tabel `struktur_organisasi` sudah dibuat
2. Verifikasi data di database: `SELECT * FROM struktur_organisasi`
3. Check API response: `/api/struktur-organisasi`

### Admin form tidak menyimpan
1. Cek console browser untuk error
2. Verifikasi koneksi database
3. Check file permissions untuk API

### Icon/Color tidak sesuai
1. Verifikasi nilai `icon` ada di `iconMap`
2. Verifikasi nilai `color` ada di Tailwind CSS
3. Rebuild aplikasi jika perlu

## Future Enhancements
- [ ] Foto profil untuk setiap struktur
- [ ] Social media links (Instagram, Twitter, dll)
- [ ] Contact info individual
- [ ] Histori perubahan struktur
- [ ] Export data ke PDF/Excel
