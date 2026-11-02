# Wakaloka

*Explore Wakatobi, Support Local.* Website pemesanan tiket wisata Wakatobi yang digabung dengan produk UMKM lokal.
Proyek Kelompok 1 · Teknik Informatika, Universitas Pancasila.

- **Frontend:** React 18 + Vite + React Router (saran asisten dosen), CSS biasa, mengikuti desain Figma, responsif (tampilan Web dan Mobile, titik pindah 768 px). Di lebar HP, layar utama memakai navigasi bawah (tab) seperti di Figma.
- **Backend:** Node.js + Express, REST API (JSON), database SQLite, login memakai token (JWT).
- **Aplikasi mobile:** React Native + Expo (folder `mobile`), Android dan iOS, memakai backend yang sama.
- Frontend, aplikasi mobile, dan backend **terpisah**; satu-satunya penghubung adalah REST API.
- Pembayaran hanya simulasi (tanpa payment gateway).

## Menjalankan

Butuh Node.js 20 atau lebih baru.

**Backend** (terminal 1)
```
cd backend
npm install
cp .env.example .env      # lalu isi JWT_SECRET dan PETUGAS_CODE
npm start                 # http://localhost:3000
```
- Dokumentasi API (Swagger): http://localhost:3000/api-docs
- Pengujian otomatis: `npm test`
- Database dibuat otomatis (`wakaloka.db`) beserta 6 destinasi dan Tenun Gelo. **Tidak ada akun awal**: buat lewat halaman Daftar.
- Data awal (`src/db/seed.js`) hanya dimasukkan saat tabel kosong. Jika kamu mengubah harga atau deskripsi di `seed.js`, database lama tidak ikut berubah: jalankan `npm run sinkron-data` (aman, akun dan pesanan tidak tersentuh) atau hapus `wakaloka.db` untuk mulai dari nol.
- Daftar sebagai Petugas Loket memerlukan kode yang sama dengan `PETUGAS_CODE` di `.env`. Jika kosong, pendaftaran petugas dinonaktifkan.

**Frontend** (terminal 2)
```
cd frontend
npm install
npm run dev                     # http://localhost:5173
```
Buka http://localhost:5173. Alamat backend bawaan `http://localhost:3000/api`; ubah lewat `VITE_API_BASE` di `frontend/.env` (contoh: `frontend/.env.example`). Alamat frontend yang diizinkan diatur di `FRONTEND_ORIGIN` pada `.env` backend (bawaan port 5173).

Untuk hosting statis (mis. GitHub Pages): `npm run build`, lalu pasang isi folder `frontend/dist`. Alamat memakai awalan `#/`, jadi tidak perlu pengaturan khusus di server.

### Aplikasi mobile (Android / iOS)

Aplikasi ini hanya berjalan di HP (tidak di laptop). Cara paling mudah: pakai aplikasi **Expo Go** (Play Store / App Store).
```bash
cd backend && npm start          # backend harus jalan dulu (port 3000)
cd mobile
npm install
npm start                        # muncul kode QR; scan dengan Expo Go (Android) atau kamera (iOS)
```
HP dan laptop harus satu Wi-Fi. Alamat backend otomatis memakai alamat laptop; bila gagal, buat `mobile/.env` dari `.env.example` dan isi `EXPO_PUBLIC_API_BASE` (contoh `http://192.168.1.10:3000/api`). Folder `backend` tidak perlu diubah.

## Struktur

```
backend/src/routes/       auth, destinations, orders, me, staff  (satu berkas per kelompok endpoint)
backend/src/services/     aturan bisnis: hitung total, masa berlaku 7 hari, validasi tiket atomik
backend/src/middleware/   cek token, cek role, validasi input (zod), penanganan galat
backend/src/db/           skema SQLite, data awal, koneksi
backend/openapi/          dokumentasi API (tampil di /api-docs)
backend/tests/            pengujian endpoint (node:test)
frontend/src/pages/       satu komponen per layar Figma
frontend/src/components/  Layout, Header, Footer, dan ui.jsx (Field, PasswordField, Stepper, DestCard, Alert, Loaded)
frontend/src/             api.js (satu-satunya pemanggil backend), auth.jsx (sesi), hooks.js, format.js, App.jsx (rute)
frontend/public/          css/style.css, font Poppins, foto destinasi (assets/img)
mobile/src/screens/       satu layar per kebutuhan (Beranda, Jelajah, Detail, Checkout, Etiket, Riwayat, Akun, Validasi, Login, Daftar)
mobile/src/components/    ui.js (Btn, Field, Stepper, DestCard, Badge, Loaded, ...), TabBar.js (navigasi bawah: ikon + label, tab aktif berpenanda kuning)
mobile/src/               api.js, auth.js (token di SecureStore), hooks.js, format.js, images.js, theme.js, App.js (navigasi)
docs/                     PRD, ERD, UML (Use Case, Class, Sequence)
```

Perbedaan kecil dari dokumen Kerangka Proyek: lapisan `controllers` digabung ke `routes` (programnya kecil), dan layar frontend berupa komponen React di `src/pages/` yang dimuat satu halaman `index.html` dengan alamat berawalan `#/` (bukan satu berkas HTML per layar).

## Peta layar → modul → endpoint

| Layar Figma | Modul frontend | Endpoint |
| :-- | :-- | :-- |
| Start | `pages/Start.jsx` | - |
| Login / Daftar | `pages/Login.jsx`, `pages/Daftar.jsx` | `POST /auth/login`, `POST /auth/register` |
| Beranda, Jelajah, Galeri, Data | `pages/Beranda.jsx`, `Jelajah.jsx`, `Galeri.jsx`, `Data.jsx` | `GET /destinations` |
| Detail destinasi | `pages/Detail.jsx` | `GET /destinations/:id` |
| Checkout | `pages/Checkout.jsx` | `GET /destinations/:id`, `POST /orders` |
| E-tiket, Terima kasih | `pages/Etiket.jsx`, `TerimaKasih.jsx` | `GET /me/tickets/:id` |
| Riwayat | `pages/Riwayat.jsx` | `GET /me/orders` |
| Akun | `pages/Akun.jsx` | `GET /me` |
| Validasi petugas | `pages/Validasi.jsx` | `GET /staff/tickets/:id`, `POST /staff/tickets/:id/validate` |
| Menu mobile (☰) | `components/Header.jsx` | - |
| Navigasi bawah (tab) | web: `components/TabBawah.jsx` (hanya lebar HP); mobile: `src/components/TabBar.js` | - |

## Pembagian tugas (usulan, sesuai dokumen Kerangka Proyek)

| Peran | Berkas utama |
| :-- | :-- |
| 1. Fondasi dan database | `backend/src/db/*`, `src/config.js`, `src/app.js`, `frontend/public/css/style.css`, `frontend/src/components/*`, `src/App.jsx`, `src/main.jsx`, `src/hooks.js` |
| 2. Akun | `routes/auth.js`, `routes/me.js` (`GET /`), `middleware/auth.js`, `pages/Login.jsx`, `Daftar.jsx`, `Akun.jsx`, `src/auth.jsx` |
| 3. Destinasi | `routes/destinations.js`, `pages/Beranda.jsx`, `Jelajah.jsx`, `Detail.jsx`, `Galeri.jsx`, `Data.jsx`, `Start.jsx` |
| 4. Pesanan dan tiket | `routes/orders.js`, `services/orders.js`, `pages/Checkout.jsx`, `Etiket.jsx`, `TerimaKasih.jsx` |
| 5. Petugas dan riwayat | `routes/staff.js`, `routes/me.js` (orders, tickets), `services/tickets.js`, `pages/Riwayat.jsx`, `Validasi.jsx` |
| 6. Dokumentasi dan pengujian | `backend/openapi/*`, `backend/tests/*`, README, pengujian alur di browser, Lighthouse |

## Alur kerja Git

- `main` dilindungi: perubahan lewat pull request (template di `.github/`), minimal satu peninjau.
- Nama cabang: `fitur/daftar-akun`, `perbaikan/total-pesanan`, `dokumen/openapi`.
- Pull request kecil dan satu topik; commit atas nama masing-masing. Ubah `openapi/openapi.js` bersama perubahan endpoint.
- Jangan commit `.env` atau kode petugas.

## Aturan bisnis penting (semua dihitung di server)

- Total = harga tiket × jumlah orang + Σ (harga produk × jumlah). Harga dari database, bukan dari frontend.
- Tiket berlaku 7 hari sejak tanggal kunjungan (inklusif); status kedaluwarsa dihitung dari tanggal.
- Validasi tiket hanya sekali (satu `UPDATE` bersyarat, aman untuk dua petugas bersamaan).
- Produk UMKM harus milik destinasi yang sama dengan tiket.
- Pesan login gagal sengaja umum agar tidak membocorkan akun.

## Jalan pintas yang disengaja (shortcut)

- Rute memakai `HashRouter` (alamat `#/...`) agar hosting statis tanpa pengaturan tambahan; ganti ke `BrowserRouter` bila server mengarahkan semua alamat ke `index.html`.
- Token JWT disimpan di `localStorage` frontend (praktis untuk frontend dan backend terpisah; untuk produksi pertimbangkan cookie httpOnly).
- Peran petugas dipilih saat mendaftar dengan kode petugas bersama (usulan; asisten dosen belum mengonfirmasi).
- `GET /me/orders` dan `GET /me/tickets` mengembalikan data yang sama (satu pesanan = satu tiket).
- Foto destinasi di `frontend/public/assets/img` (dan `mobile/assets/img`) beresolusi kecil (406×260 px); ganti dengan foto beresolusi tinggi bila ada (nama berkas tetap). Foto Tenun Gelo dan logo asli sudah terpasang.
- Aplikasi mobile: layar Start, Galeri, Data, dan Terima kasih tidak dibuat (Selesai di e-tiket langsung kembali ke Beranda); tanggal kunjungan dipilih dari 30 hari ke depan; foto dibawa di dalam aplikasi; ikon dan splash bawaan Expo (ganti sebelum build rilis); dijalankan lewat Expo Go.
- Tanpa mode gelap (desain Figma hanya mode terang).
- Tanggal "hari ini" memakai zona waktu Asia/Jakarta.
