# WakaLoka

*Explore Wakatobi, Support Local*

WakaLoka adalah website dan aplikasi mobile pemesanan tiket wisata Kabupaten Wakatobi yang digabung dengan produk UMKM lokal. Wisatawan memesan tiket secara online, lalu cukup menunjukkan ID e-tiket kepada petugas loket. Pembayaran bersifat simulasi (tanpa payment gateway).

Proyek Kelompok 1, Program Studi Teknik Informatika, Universitas Pancasila.

> Seluruh kode ada di folder [`wakaloka-final`](./wakaloka-final). Panduan teknis lengkap (endpoint, pembagian tugas, jalan pintas yang disengaja) ada di [`wakaloka-final/README.md`](./wakaloka-final/README.md).

## Fitur

- Menampilkan enam destinasi wisata Wakatobi beserta tarif, rating, dan produk UMKM-nya (Beranda, Jelajah, Galeri, Data).
- Daftar dan masuk sebagai **Wisatawan** atau **Petugas Loket** (petugas memakai kode dari pengelola loket).
- Pesan tiket: pilih tanggal kunjungan, jumlah orang, dan produk UMKM opsional. Total dihitung oleh server.
- E-tiket berisi ID unik dengan masa berlaku 7 hari, serta riwayat pesanan milik sendiri.
- Petugas Loket mencari dan memvalidasi tiket. Tiket hanya bisa dipakai satu kali.
- Tampilan web responsif dan aplikasi mobile (Android dan iOS), keduanya mengikuti desain Figma.

## Teknologi

| Bagian | Teknologi |
| :-- | :-- |
| Backend | Node.js, Express, REST API (JSON), SQLite (`better-sqlite3`), JWT, bcrypt, zod, dokumentasi Swagger |
| Frontend web | React 18, Vite, React Router, CSS biasa |
| Aplikasi mobile | React Native, Expo |
| Desain dan dokumen | Figma, PRD, ERD (notasi Chen), UML (Use Case, Class, Sequence) |

Frontend web, aplikasi mobile, dan backend **terpisah**; satu-satunya penghubung adalah REST API.

## Struktur Folder

```
Project-BasisData-A-Kelompok-wakaloka/
├── README.md                          file ini
├── .gitignore
└── wakaloka-final/
    ├── README.md                      panduan teknis lengkap
    ├── .gitignore
    ├── .github/
    │   └── pull_request_template.md   templat pull request
    │
    ├── backend/                       REST API (Express + SQLite)
    │   ├── package.json
    │   ├── .env.example               contoh pengaturan (salin menjadi .env)
    │   ├── openapi/
    │   │   └── openapi.js             dokumentasi API (tampil di /api-docs)
    │   ├── scripts/
    │   │   └── sinkron-data.js        samakan data destinasi di database lama dengan seed
    │   ├── src/
    │   │   ├── server.js, app.js      titik mulai server dan susunan Express
    │   │   ├── config.js, errors.js   pembacaan .env dan galat aplikasi
    │   │   ├── db/                    schema.sql, seed.js, index.js (koneksi SQLite)
    │   │   ├── middleware/            auth.js, validate.js, error.js
    │   │   ├── routes/                auth, destinations, orders, me, staff
    │   │   └── services/              orders.js (hitung total), tickets.js (validasi tiket)
    │   └── tests/
    │       └── api.test.js            pengujian endpoint
    │
    ├── frontend/                      website (React + Vite)
    │   ├── package.json, vite.config.js, index.html
    │   ├── .env.example
    │   ├── public/
    │   │   ├── css/style.css          token desain dan gaya bersama
    │   │   └── assets/                fonts (Poppins) dan img (foto destinasi)
    │   └── src/
    │       ├── main.jsx, App.jsx      titik mulai dan rute
    │       ├── api.js, auth.jsx       pemanggilan API dan sesi login
    │       ├── format.js, hooks.js    pembantu format dan pengambilan data
    │       ├── components/            Header, Footer, Layout, TabBawah, ui
    │       └── pages/                 satu berkas per layar: Start, Beranda, Jelajah, Detail,
    │                                  Checkout, Etiket, TerimaKasih, Riwayat, Akun, Login,
    │                                  Daftar, Galeri, Data, Validasi
    │
    ├── mobile/                        aplikasi Android dan iOS (React Native + Expo)
    │   ├── package.json, app.json, index.js
    │   ├── .env.example
    │   ├── assets/img/                foto destinasi
    │   └── src/
    │       ├── App.js                 navigasi
    │       ├── api.js, auth.js        pemanggilan API dan sesi login
    │       ├── theme.js, format.js, hooks.js, images.js
    │       ├── components/            TabBar (navigasi bawah), ui
    │       └── screens/               Beranda, Jelajah, Detail, Checkout, Etiket, Riwayat,
    │                                  Akun, Validasi, Login, Daftar
    │
    ├── Docs/                          dokumen perancangan (sumber)
    │   ├── prd/                       Product Requirements Document (.md)
    │   ├── erd/                       ERD notasi Chen (.drawio)
    │   ├── uml/                       Use Case, Class, dan Sequence Diagram (.drawio)
    │   └── pdf/                       versi PDF dari PRD, ERD, dan UML
    └── docs_pdf_tim/                  salinan PDF dokumen dari anggota tim
```

## Menjalankan

Prasyarat: Node.js 20 atau lebih baru. Jalankan dari folder utama repositori.

**1. Backend** (terminal 1)
```
cd wakaloka-final/backend
npm install
cp .env.example .env        # lalu isi JWT_SECRET dan PETUGAS_CODE
npm start                   # http://localhost:3000
```
- Dokumentasi API (Swagger): http://localhost:3000/api-docs
- Pengujian: `npm test`
- Database `wakaloka.db` dibuat otomatis beserta 6 destinasi dan Tenun Gelo. **Tidak ada akun awal**, jadi buat akun lewat halaman Daftar.
- Mendaftar sebagai Petugas Loket memerlukan kode yang sama dengan `PETUGAS_CODE` di `.env`.
- Berkas `.env` tidak ikut ke GitHub. Tiap anggota membuat `.env` sendiri.

**2. Website** (terminal 2)
```
cd wakaloka-final/frontend
npm install
npm run dev                 # http://localhost:5173
```

**3. Aplikasi mobile** (terminal 3, opsional)
```
cd wakaloka-final/mobile
npm install
npx expo start              # pindai kode QR dengan Expo Go
```
HP dan laptop harus satu jaringan Wi-Fi. Jika alamat backend tidak terdeteksi, salin `mobile/.env.example` menjadi `mobile/.env` lalu isi `EXPO_PUBLIC_API_BASE`.

## Dokumentasi

| Dokumen | Sumber | PDF |
| :-- | :-- | :-- |
| Product Requirements Document (PRD) | [PRD](./wakaloka-final/Docs/prd/PRD%20Wakaloka%20%281%29.md) | [PDF](./wakaloka-final/Docs/pdf/PRD_Wakaloka.pdf) |
| ERD (notasi Chen) | [ERD](./wakaloka-final/Docs/erd/ERD_WAKALOKA_Chen%20%281%29.drawio) | [PDF](./wakaloka-final/Docs/pdf/ERD_Chen.pdf) |
| Class Diagram | [Class](./wakaloka-final/Docs/uml/ClassDiagram_WAKALOKA%20%281%29.drawio) | [PDF](./wakaloka-final/Docs/pdf/UML_Class_Diagram.pdf) |
| Sequence Diagram | [Sequence](./wakaloka-final/Docs/uml/Sequence_WAKALOKA%20%281%29.drawio) | [PDF](./wakaloka-final/Docs/pdf/UML_Sequence_Diagram.pdf) |
| Use Case Diagram | [Use Case](./wakaloka-final/Docs/uml/UseCase_WAKALOKA%20%281%29.drawio) | [PDF](./wakaloka-final/Docs/pdf/UML_Use_Case_Diagram.pdf) |
| Desain UI/UX | [Figma](https://www.figma.com/design/yUQXNEK8uFb79RhNBe124C/wakaloka-basdat) | - |
| Dokumentasi API | Jalankan backend lalu buka `/api-docs` | - |

## Kontribusi

- Cabang `main` hanya diubah lewat pull request (templat ada di `wakaloka-final/.github`), dengan minimal satu peninjau.
- Nama cabang: `fitur/nama-fitur`, `perbaikan/nama-masalah`, atau `dokumen/nama-dokumen`.
- Sebelum mulai bekerja jalankan `git pull`. Jangan commit `.env`, `node_modules`, atau berkas `.db`.
- Pembagian berkas per anggota ada di tabel peran pada [`wakaloka-final/README.md`](./wakaloka-final/README.md).

## Anggota Kelompok

| No. | Nama | NPM |
|---|---|---|
| 1 | Irvan Indra Mustofa | 4525210107 |
| 2 | Muhamad Rasha Zein | 4525210042 |
| 3 | Muhammad Farrel Rizky | 4525210117 |
| 4 | Muzaki Arifin | 4525210051 |
| 5 | Nur Wahyu Muhtiin Haniv | 4525210078 |
| 6 | Rangga Prataya Setiono Putro | 4525210131 |