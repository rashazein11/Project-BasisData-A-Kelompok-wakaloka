# WakaLoka (Wisata Lokal Wakatobi)

**Kelompok 1 – Basis Data - A** · Product Requirements Document (PRD)

*Explore Wakatobi, Support Local*

## 1. Latar Belakang
Wakatobi memiliki destinasi wisata alam dan produk UMKM lokal (hasil laut dan kerajinan) yang belum terhubung dalam satu platform digital. Wisatawan harus mencari informasi dan membeli tiket secara terpisah, sedangkan pelaku UMKM di sekitar tempat wisata masih minim promosi dan adopsi teknologi digital. Dibutuhkan website pemesanan tiket yang sekaligus menjadi sarana promosi produk UMKM.

## 2. Tujuan
- Mengenalkan keindahan dan informasi destinasi wisata Wakatobi kepada audiens yang lebih luas.
- Memudahkan wisatawan memesan tiket wisata secara online dan masuk cukup dengan menunjukkan ID E-Ticket.
- Memberi ruang bagi pelaku UMKM untuk memasarkan produk melalui konsep bundling tiket wisata dan produk UMKM.
- Menyediakan basis data yang sederhana (6 tabel) dan mudah dipelihara.

## 3. Deskripsi Produk
WakaLoka adalah website pemesanan tiket wisata Wakatobi. Wisatawan menjelajahi destinasi, melihat harga tiket, rating, dan produk UMKM di setiap tempat wisata, lalu memesan tiket (dengan atau tanpa produk UMKM) dan menerima E-Ticket berisi ID tiket yang ditunjukkan kepada petugas loket.

Alur halaman: Start → Login → Home → Explore → Profil Wisata → Check Out → E-Ticket → Terima Kasih.

## 4. Kebutuhan Pengguna
- Sebagai wisatawan, saya ingin melihat rekomendasi dan daftar wisata Wakatobi beserta harga dan rating agar mudah memilih tujuan.
- Sebagai wisatawan, saya ingin memesan tiket secara online agar tidak perlu antre membeli di lokasi.
- Sebagai wisatawan, saya ingin menambahkan produk UMKM ke dalam pesanan agar bisa membawa oleh-oleh khas.
- Sebagai wisatawan, saya ingin menyimpan E-Ticket dan melihat riwayat pemesanan di profil.
- Sebagai petugas loket, saya ingin memeriksa ID tiket wisatawan untuk memastikan tiket valid.

## 5. Ruang Lingkup
**Termasuk:** login, halaman Home (2 rekomendasi wisata), Explore (daftar wisata), Profil Wisata (detail wisata dan produk UMKM), Check Out (ringkasan pembayaran), E-Ticket, halaman Terima Kasih, serta profil dan riwayat pemesanan.

**Tidak termasuk:** pendaftaran akun pada prototipe, metode pembayaran digital yang beragam, ulasan pengguna, rekomendasi berbasis AI atau lokasi, dan panel admin untuk pengelolaan data wisata dan UMKM.

## 6. Persyaratan Fungsional
| Kode | Persyaratan | Tabel ERD |
|---|---|---|
| FR-01 | Pengguna login dengan email atau No. telp dan password | PENGGUNA |
| FR-02 | Halaman Home menampilkan 2 rekomendasi wisata | WISATA |
| FR-03 | Halaman Explore menampilkan daftar wisata beserta harga tiket dan rating | WISATA |
| FR-04 | Profil Wisata menampilkan foto, rating, harga tiket, deskripsi, dan daftar produk UMKM (nama dan harga) | WISATA, PRODUK_UMKM |
| FR-05 | Pengguna mengisi jadwal kunjungan dan jumlah orang, lalu menambahkan produk UMKM ke pesanan | PEMESANAN, DETAIL_PRODUK_PESANAN |
| FR-06 | Halaman Check Out menampilkan ringkasan pembayaran (tiket dan produk UMKM) serta total pembayaran | PEMESANAN, DETAIL_PRODUK_PESANAN |
| FR-07 | Tombol Order Now memproses pesanan dan menerbitkan E-Ticket dengan ID tiket | PEMESANAN, TIKET |
| FR-08 | E-Ticket menampilkan wisata, tanggal, jumlah orang, masa berlaku (7 hari sejak tanggal kunjungan), dan ID tiket | TIKET, PEMESANAN |
| FR-09 | Petugas loket memeriksa ID tiket; tiket yang sudah dipakai ditandai terpakai | TIKET |
| FR-10 | Profil menampilkan data diri dan riwayat pemesanan | PENGGUNA, PEMESANAN |
| FR-11 | Halaman Terima Kasih tampil setelah E-Ticket, dengan tombol kembali ke Beranda | (hanya tampilan) |

## 7. Persyaratan Non-Fungsional
- **Keamanan:** password disimpan dalam bentuk hash.
- **Kegunaan:** antarmuka bernuansa alam Wakatobi (hijau `#8DA249`, jingga `#F89254`, biru `#7BADCA`, kuning `#FFDE59`, krem `#FBE1B5`); font Oleo Script Swash Caps (brand), Alexandria (tombol dan nama wisata), AR One Sans (deskripsi).
- **Performa:** halaman Explore dan Profil Wisata tampil kurang dari 3 detik (usulan).
- **Keandalan:** E-Ticket tetap dapat dibuka kembali dari riwayat pemesanan.

## 8. Risiko dan Asumsi
**Risiko:** koneksi internet di beberapa lokasi wisata terbatas; pelaku UMKM belum terbiasa dengan teknologi digital sehingga data produk bisa tidak diperbarui; harga tiket dan produk dapat berubah sewaktu-waktu.

**Asumsi:** wisatawan memiliki email atau No. telp dan koneksi internet; satu pemesanan untuk satu destinasi wisata; satu pemesanan menghasilkan satu E-Ticket; masa berlaku tiket selalu 7 hari sejak tanggal kunjungan.

## 9. Rancangan Basis Data (6 tabel)
| Tabel | Kolom (PK = garis bawah, FK = *) | Keterangan |
|---|---|---|
| PENGGUNA | <u>id_pengguna</u>, nama, email, no_telp, password | Akun wisatawan |
| WISATA | <u>id_wisata</u>, nama_wisata, deskripsi, harga_tiket, rating, foto | Destinasi wisata |
| PRODUK_UMKM | <u>id_produk</u>, id_wisata*, nama_produk, harga, foto | Produk UMKM di tempat wisata |
| PEMESANAN | <u>id_pemesanan</u>, id_pengguna*, id_wisata*, tgl_pesan, tgl_kunjungan, jumlah_orang | Transaksi pemesanan tiket |
| DETAIL_PRODUK_PESANAN | <u>id_pemesanan*</u>, <u>id_produk*</u>, jumlah | Tabel penghubung M:N PEMESANAN dan PRODUK_UMKM |
| TIKET | <u>id_tiket</u>, id_pemesanan* (unik), status_tiket | E-Ticket (aktif atau terpakai) |

**Relasi:**
- PENGGUNA 1:N PEMESANAN (melakukan)
- WISATA 1:N PEMESANAN (dipesan)
- WISATA 1:N PRODUK_UMKM (menjual)
- PEMESANAN 1:N DETAIL_PRODUK_PESANAN (memuat)
- PRODUK_UMKM 1:N DETAIL_PRODUK_PESANAN (dipesan dalam)
- PEMESANAN 1:1 TIKET (menghasilkan)

**Catatan desain:** nilai turunan tidak disimpan. Total pembayaran dihitung dari `harga_tiket × jumlah_orang` ditambah subtotal produk, dan masa berlaku tiket dihitung dari `tgl_kunjungan + 7 hari`.

## 10. Pemetaan Class Diagram ke Tabel
| Class | Tabel |
|---|---|
| Pengguna | PENGGUNA |
| Wisata | WISATA |
| ProdukUMKM | PRODUK_UMKM |
| Pemesanan | PEMESANAN |
| DetailProdukPesanan | DETAIL_PRODUK_PESANAN |
| Tiket | TIKET |

Atribut class memakai camelCase (misalnya `noTelp`) dan kolom tabel memakai snake_case (misalnya `no_telp`). Method tidak dibawa ke tabel.

## 11. Anggota Kelompok
| No | Nama | NPM |
|---|---|---|
| 1 | Irvan Indra Mustofa | 4525210107 |
| 2 | Muhamad Rasha Zein | 4525210042 |
| 3 | Muhammad Farrel Rizky | 4525210117 |
| 4 | Muzaki Arifin | 4525210051 |
| 5 | Nur Wahyu Muhtiin Haniv | 4525210078 |
| 6 | Rangga Prataya Setiono Putro | 4525210131 |

## 12. Diagram
| Diagram | File |
|---|---|
| ERD (notasi crow's foot) | `docs/ERD_WAKALOKA.drawio` |
| ERD WAKALOKA Chen.drawio | `ERD_WAKALOKA_Chen.drawio`|
| Class Diagram | `docs/ClassDiagram_WAKALOKA.drawio` |

Kedua file dapat dibuka di Google Drive (https://drive.google.com/drive/folders/1Wozk-8aUyhlT0MUuHrcFAYlq6ZlRbGT-?usp=sharing)
