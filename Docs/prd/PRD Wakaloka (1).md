# **Product Requirements Document – Wakaloka**

*Explore Wakatobi, Support Local*

Disusun oleh:  Kelompok \- 1

| 1 | Irvan Indra Mustofa | 4525210107 |
| :---- | :---- | :---- |
| 2 | Muhamad Rasha Zein | 4525210042 |
| 3 | Muhammad Farrel Rizky | 4525210117 |
| 4 | Muzaki Arifin | 4525210051 |
| 5 | Nur Wahyu Muhtiin Haniv | 4525210078 |
| 6 | Rangga Prataya Setiono Putro | 4525210131 |

 Program Studi Teknik Informatika, Universitas Pancasila · Mata kuliah Desain Web

## **1\. Informasi Dokumen**

| Atribut | Nilai |
| :---- | :---- |
| Nama Produk | Wakaloka |
| Versi Dokumen | 1.0 (Draft) |
| Tanggal | 27 Oktober 2026 |
| Jenis Produk | Website pemesanan tiket wisata Kabupaten Wakatobi yang digabung dengan produk UMKM lokal |
| Status Saat Ini | Website statis 4 halaman (Beranda, Profil, Galeri, Data) sudah selesai |
| Platform | Web (desktop dan mobile browser) |
| Referensi | Struktur PRD InahuyShop (kelompok), diagram Use Case, Class, Sequence, dan ERD Chen Wakaloka, serta tangkapan layar website statis |

## **2\. Ringkasan Eksekutif**

Wakaloka adalah website pemesanan tiket wisata di Kabupaten Wakatobi. Wisatawan memesan tiket secara online, lalu cukup menunjukkan ID e-ticket kepada petugas loket. Setiap tiket dapat digabung dengan produk UMKM lokal di destinasi yang sama, misalnya Tenun Gelo, sehingga perjalanan wisatawan ikut menggerakkan ekonomi daerah.

Saat ini Wakaloka baru berupa website statis yang menampilkan profil, galeri, dan data tarif. PRD ini menetapkan kebutuhan produk dan tahapan pengembangan untuk mengubahnya menjadi alur pemesanan yang utuh: Start, Login, Home, Explore, detail wisata, Check Out, E-Tiket, dan halaman terima kasih.

## **3\. Latar Belakang dan Masalah**

* Wisatawan belum punya satu tempat untuk melihat tarif, rating, dan memesan tiket destinasi Wakatobi tanpa antre di loket.  
* Pelaku UMKM Wakatobi belum punya kanal digital untuk memamerkan dan menjual produk unggulan (hasil laut dan kerajinan).  
* Adopsi teknologi digital pada UMKM Wakatobi masih rendah, sehingga produk lokal sulit menjangkau pasar yang lebih luas.  
* Dibutuhkan desain UI/UX yang intuitif, menjaga budaya lokal, dan sekaligus meningkatkan daya saing UMKM.

## **4\. Tujuan dan Indikator Keberhasilan**

### **4.1 Tujuan Produk**

1. Mengenalkan kelebihan dan keindahan destinasi wisata Wakatobi kepada audiens yang lebih luas melalui media digital.  
2. Memberi ruang bagi pelaku UMKM Wakatobi untuk memamerkan dan memasarkan produk unggulan.  
3. Merancang solusi desain UI/UX yang efektif untuk mendukung pemasaran dan pengembangan UMKM.  
4. Menyediakan alur pemesanan tiket digital yang selesai dengan e-ticket valid.

### **4.2 Indikator Keberhasilan (target usulan)**

| Metrik | Target | Cara Ukur |
| :---- | :---- | :---- |
| Kelengkapan fitur prioritas P0 | 100 persen memenuhi acceptance criteria | Checklist pengujian fungsional |
| Kebenaran total pembayaran | 100 persen sesuai rumus (tiket × jumlah orang \+ produk UMKM) | Uji skenario hitung total |
| Keunikan ID tiket | Tidak ada ID tiket ganda | Pemeriksaan data |
| Langkah dari Home ke E-Tiket | Maksimal 6 layar | Uji alur manual |
| Largest Contentful Paint | Maksimal 2,5 detik | Lighthouse |
| Aksesibilitas | Lighthouse Accessibility minimal 90 | Lighthouse dan uji keyboard |
| Responsivitas | Tampilan benar pada lebar desktop dan mobile | Uji browser |

## **5\. Pengguna dan Peran**

| Peran | Deskripsi | Use Case Utama |
| :---- | :---- | :---- |
| Wisatawan | Wisatawan dari Indonesia yang ingin berkunjung ke tempat wisata lokal di Wakatobi | Login, lihat rekomendasi, jelajahi wisata, lihat detail, pesan tiket, tambah produk UMKM, lihat ringkasan pembayaran, lihat e-ticket, lihat riwayat |
| Petugas Loket | Petugas di lokasi wisata yang memeriksa e-ticket | Validasi tiket berdasarkan ID tiket |

Pelaku UMKM belum memiliki akun sendiri pada cakupan ini. Data produk UMKM disiapkan oleh tim dan ditampilkan bersama destinasi terkait.

## **6\. Cakupan Produk**

### **6.1 Termasuk dalam Cakupan**

* Halaman informasi: Beranda, Profil (konsep sistem, warna, tipografi, tim), Galeri, dan Data.  
* Login pengguna.  
* Rekomendasi dan daftar enam destinasi beserta tarif dan rating.  
* Detail wisata dan produk UMKM yang ditawarkan di destinasi tersebut.  
* Pemesanan tiket (tanggal kunjungan, jumlah orang), penambahan produk UMKM, dan ringkasan pembayaran.  
* E-ticket dengan ID tiket dan masa berlaku.  
* Riwayat pemesanan dan profil pengguna.  
* Validasi tiket oleh petugas loket.

### **6.2 Di Luar Cakupan**

* Payment gateway produksi (pembayaran bersifat ringkasan atau simulasi).  
* Refund, penjadwalan ulang, dan pembatalan tiket.  
* Akun mandiri untuk pelaku UMKM.  
* Pengiriman produk UMKM ke luar Wakatobi (produk diambil di destinasi).  
* Multi-bahasa dan multi-mata uang.  
* Notifikasi email atau WhatsApp.  
* Aplikasi native Android dan iOS.

## **7\. Kondisi Saat Ini (Baseline Website Statis)**

### **7.1 Halaman yang Sudah Ada**

| Halaman | Isi yang Sudah Tersedia |
| :---- | :---- |
| Beranda | Hero tagline, 3 rekomendasi destinasi (Goa Kontamale, Pulau Hoga, Tomia Puncak Khayangan), cara memesan, footer |
| Profil | Konsep sistem, tujuan, rumusan masalah, konsep warna (5 warna), tipografi Poppins, tabel tim |
| Galeri | 6 kartu destinasi dan 1 produk UMKM (Tenun Gelo, Rp 190.000) |
| Data | Tabel tarif dan rating, contoh pesanan, alur halaman aplikasi, tabel fitur utama |

### **7.2 Data Destinasi**

| Destinasi | Harga Tiket | Rating |
| :---- | :---- | :---- |
| Tomia Puncak Khayangan | Rp 25.000 | 5,0 |
| Mangrove Sombano | Rp 25.000 | 4,7 |
| Pantai Pulau Anano | Rp 159.000 | 5,0 |
| Pulau Binongko | Rp 50.000 | 5,0 |
| Pulau Hoga | Rp 150.000 | 5,0 |
| Goa Kontamale | Rp 20.000 | 4,8 |

### **7.3 Contoh Pesanan (acuan perhitungan)**

Paket Tomia Puncak Khayangan untuk 1 orang, jadwal 25 April 2026, berlaku hingga 2 Mei 2026\.

| Item | Jumlah | Harga |
| :---- | :---- | :---- |
| Paket Tomia Puncak Khayangan | 1 | Rp 25.000 |
| Tenun Gelo (UMKM) | 1 | Rp 190.000 |
| **Total pembayaran** |  | **Rp 215.000** |

### **7.4 Kesenjangan yang Harus Ditutup**

* Tombol Lihat tarif, Lihat tarif destinasi, dan alur pemesanan belum terhubung ke proses apa pun (belum ada login, detail wisata, check out, e-ticket).  
* Data destinasi masih tertulis langsung di HTML, belum bersumber dari satu data terpusat.  
* Produk UMKM baru satu (Tenun Gelo) dan belum ada untuk destinasi lain.  
* Belum ada halaman detail wisata, halaman Explore, dan halaman profil pengguna.  
* Konsistensi konten perlu dirapikan (lihat bagian 16 dan 17).

## **8\. Tahapan Pengembangan**

| Fase | Nama | Hasil Utama | Status |
| :---- | :---- | :---- | :---- |
| 0 | Website statis | 4 halaman informasi | Selesai |
| 1 | Perapian konten dan data | Data destinasi dan UMKM terpusat, konten konsisten | Berikutnya |
| 2 | Alur pemesanan prototipe | Start, Login, Home, Explore, Detail, Check Out, E-Tiket, Terima kasih | Direncanakan |
| 3 | Backend dan database | Data tersimpan, akun, pemesanan, tiket | Direncanakan |
| 4 | Petugas loket dan riwayat | Validasi tiket, riwayat, profil | Direncanakan |
| 5 | Pengujian dan rilis | Uji fungsional, aksesibilitas, performa, publikasi | Direncanakan |

### **Fase 0 – Website Statis (Selesai)**

* Tujuan: menyajikan konsep Wakaloka, palet warna, tipografi, galeri, dan data tarif.  
* Kriteria selesai: empat halaman tampil konsisten dengan navigasi dan footer yang sama.

### **Fase 1 – Perapian Konten dan Data**

* Tujuan: menjadikan satu sumber data untuk enam destinasi dan produk UMKM, serta menyamakan isi antarhalaman.  
* Pekerjaan: menyusun data destinasi (nama, deskripsi, harga tiket, rating, foto), menyusun data produk UMKM per destinasi, menyamakan istilah (kelompok, jumlah rekomendasi, alur), memeriksa harga yang janggal, dan melengkapi teks alternatif gambar.  
* Kriteria selesai: tarif dan rating pada Beranda, Galeri, dan Data identik; setiap destinasi punya minimal satu produk UMKM atau keterangan belum tersedia.

### **Fase 2 – Alur Pemesanan Prototipe**

* Tujuan: pengguna dapat menjalankan pemesanan dari awal sampai E-Tiket di browser.  
* Pekerjaan: halaman Start, Login, Home (rekomendasi), Explore (6 destinasi), Detail wisata (rating, tarif, produk UMKM), Check Out (tanggal kunjungan, jumlah orang, produk UMKM, ringkasan pembayaran, tombol Order Now), E-Tiket (ID tiket), dan Terima kasih (kembali ke Beranda).  
* Kriteria selesai: contoh pesanan pada bagian 7.3 menghasilkan total Rp 215.000 dan e-ticket dengan masa berlaku hingga 2 Mei 2026; alur dapat dijalankan tanpa error di desktop dan mobile.

### **Fase 3 – Backend dan Database**

* Tujuan: data pengguna, pemesanan, dan tiket tersimpan permanen serta perhitungan dilakukan di server.  
* Pekerjaan: merancang database sesuai ERD (bagian 12), autentikasi (hash password), endpoint wisata, pemesanan, dan tiket, serta pembuatan ID tiket unik.  
* Kriteria selesai: seluruh fungsi Fase 2 memakai data dari server; total dan masa berlaku dihitung di server.

### **Fase 4 – Petugas Loket dan Riwayat**

* Tujuan: tiket dapat diperiksa dan wisatawan dapat melihat riwayatnya.  
* Pekerjaan: halaman validasi tiket untuk petugas loket, halaman Profile (data diri, informasi akun, riwayat pemesanan), dan perubahan status tiket setelah divalidasi.  
* Kriteria selesai: tiket yang sudah divalidasi tidak dapat dipakai lagi dan tiket kedaluwarsa ditolak.

### **Fase 5 – Pengujian dan Rilis**

* Tujuan: produk siap dipresentasikan dan dipublikasikan.  
* Pekerjaan: uji fungsional seluruh alur, uji aksesibilitas dan performa, perbaikan temuan, dan publikasi.  
* Kriteria selesai: seluruh acceptance criteria P0 lulus dan definisi selesai (bagian 15\) terpenuhi.

## **9\. Persyaratan Fungsional**

P0 adalah wajib untuk rilis utama. P1 penting dan dikerjakan setelah P0 selesai.

| ID | Fitur | Prioritas | Fase | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| FR-01 | Halaman informasi (Beranda, Profil, Galeri, Data) | P0 | 0 | Empat halaman tampil dengan navigasi dan footer yang sama |
| FR-02 | Login | P0 | 2, 3 | Masuk dengan email atau nomor telepon dan password; pesan gagal tidak membocorkan data akun |
| FR-03 | Rekomendasi wisata (Home) | P0 | 2 | Menampilkan rekomendasi destinasi dengan tombol View, Explore, dan Profile |
| FR-04 | Jelajah wisata (Explore) | P0 | 2 | Menampilkan enam destinasi dengan tarif, rating, dan tombol View |
| FR-05 | Detail wisata | P0 | 2 | Menampilkan deskripsi, foto, tarif, rating, produk UMKM, dan tombol Check Out |
| FR-06 | Pemesanan tiket | P0 | 2, 3 | Pengguna memilih tanggal kunjungan dan jumlah orang; jumlah minimal 1 |
| FR-07 | Tambah produk UMKM | P0 | 2, 3 | Produk UMKM dapat ditambahkan opsional dengan jumlah; dapat tidak dipilih |
| FR-08 | Ringkasan pembayaran | P0 | 2, 3 | Menampilkan item, jumlah, harga, dan total sesuai rumus pada BR-03 |
| FR-09 | Order Now dan E-Tiket | P0 | 2, 3 | Setelah Order Now, tiket dibuat dengan ID tiket unik, tanggal berlaku, dan status aktif |
| FR-10 | Halaman terima kasih | P1 | 2 | Tombol Kembali ke Beranda berfungsi |
| FR-11 | Riwayat pemesanan | P1 | 4 | Pengguna hanya melihat pesanannya sendiri |
| FR-12 | Profile pengguna | P1 | 4 | Menampilkan data diri dan informasi akun |
| FR-13 | Validasi tiket oleh petugas loket | P0 | 4 | ID tiket valid dan belum dipakai diterima, lalu berstatus terpakai; tiket kedaluwarsa atau sudah terpakai ditolak |

## **10\. Aturan Bisnis**

| ID | Aturan |
| :---- | :---- |
| BR-01 | Satu pemesanan berlaku untuk satu destinasi wisata. |
| BR-02 | Produk UMKM yang ditawarkan terikat pada destinasi yang sama dengan tiket. |
| BR-03 | Total pembayaran \= (harga tiket × jumlah orang) \+ jumlah seluruh (harga produk UMKM × jumlah produk). |
| BR-04 | Masa berlaku tiket dihitung dari tanggal kunjungan; berdasarkan contoh pesanan, tiket berlaku 7 hari (25 April sampai 2 Mei) dan tidak berlaku setelah tanggal tersebut. |
| BR-05 | Setiap tiket memiliki ID tiket unik yang ditunjukkan ke petugas loket. |
| BR-06 | Tiket hanya dapat divalidasi satu kali. |
| BR-07 | Pembayaran bersifat ringkasan atau simulasi, tanpa payment gateway. |
| BR-08 | Pengguna hanya dapat melihat pesanan dan tiket miliknya sendiri. |

## **11\. Alur Pengguna Utama**

1. Halaman Awal: tombol Start memulai aplikasi.  
2. Login: masuk dengan email atau nomor telepon dan password.  
3. Home: rekomendasi wisata, tombol View, Explore, dan Profile.  
4. Explore: enam pilihan wisata dengan tombol View.  
5. Profil wisata: detail destinasi dan produk UMKM, tombol Check Out.  
6. Check Out: konfirmasi pesanan, tombol Order Now.  
7. E-Tiket: tiket digital dengan ID tiket untuk petugas loket.  
8. Terima kasih: tombol Kembali ke Beranda.

Percabangan login: jika login gagal, sistem menampilkan pesan login gagal dan pengguna tetap di halaman Login. Penambahan produk UMKM bersifat opsional pada langkah Check Out.

## **12\. Model Data**

Model data mengikuti ERD Chen Wakaloka dengan lima entitas dan satu tabel detail hasil pemecahan relasi M:N.

| Entitas | Atribut | Keterangan |
| :---- | :---- | :---- |
| PENGGUNA | id\_pengguna (PK), nama, email, no\_telp, password | Satu pengguna dapat membuat banyak pemesanan |
| WISATA | id\_wisata (PK), nama\_wisata, deskripsi, harga\_tiket, rating, foto | Satu wisata dapat dipesan berkali-kali dan menjual banyak produk UMKM |
| PEMESANAN | id\_pemesanan (PK), id\_pengguna (FK), id\_wisata (FK), tgl\_pesan, tgl\_kunjungan, jumlah\_orang | Satu pemesanan menghasilkan satu tiket |
| TIKET | id\_tiket (PK), id\_pemesanan (FK), status\_tiket | Status usulan: aktif, terpakai, kedaluwarsa |
| PRODUK\_UMKM | id\_produk (PK), id\_wisata (FK), nama\_produk, harga, foto | Terikat pada satu wisata |
| DETAIL\_PRODUK\_PESANAN | id\_pemesanan (FK), id\_produk (FK), jumlah | Menghubungkan pemesanan dan produk UMKM (relasi M:N) |

Catatan kelas: Pemesanan memiliki operasi hitungTotal(), hitungMasaBerlaku(), dan konfirmasi(); Tiket memiliki tampilkanETiket() dan validasi(). Nilai total dan masa berlaku dihitung dan divalidasi di sisi server pada Fase 3\.

## **13\. Persyaratan Non-Fungsional**

### **13.1 Desain dan Tipografi**

* Palet warna mengikuti halaman Profil: Hijau \#8DA249, Jingga \#F89254, Biru \#7BADCA, Kuning \#FFDE59, dan Krem \#FBE1B5.  
* Poppins digunakan sebagai satu-satunya jenis font dan dimuat lokal dari folder assets/fonts.  
* Bahasa antarmuka adalah Bahasa Indonesia; mata uang Rupiah (IDR) dengan format Rp 25.000.

### **13.2 Performa, Responsivitas, dan Aksesibilitas**

* Largest Contentful Paint maksimal 2,5 detik; gambar dikompresi dan memiliki ukuran yang sesuai.  
* Tata letak responsif pada desktop dan mobile.  
* Semua gambar memiliki teks alternatif; kontras teks memenuhi WCAG 2.1 AA; seluruh alur dapat digunakan dengan keyboard dengan fokus yang terlihat.  
* Form menampilkan pesan error yang jelas.

### **13.3 Keamanan dan Privasi (berlaku mulai Fase 3\)**

* Password disimpan sebagai hash, bukan teks biasa.  
* Query database menggunakan parameterized query; output teks dikodekan untuk mencegah XSS.  
* Otorisasi dan perhitungan total dilakukan di server.  
* Data pribadi hanya dapat diakses oleh pemiliknya.

### **13.4 Teknologi yang Digunakan**

Pilihan ini dibuat paling sederhana: satu bahasa (JavaScript) dari halaman web sampai server, dan tanpa instalasi database terpisah.

| Lapisan | Pilihan | Alasan |
| :---- | :---- | :---- |
| Tampilan | HTML5, CSS3, JavaScript biasa. | Sudah dipakai pada website statis; tidak perlu build tool |
| Font dan desain | Poppins lokal dan palet warna Profil | Sudah ada dan konsisten |
| Data Fase 1 dan 2 | File JSON dan localStorage browser | Prototipe berjalan tanpa server |
| Backend (Fase 3\) | Node.js dengan Express | Bahasa sama dengan tampilan, mudah dipelajari |
| Database (Fase 3\) | Mysql | Skema ERD yang sama dapat dipindah ke MySQL |
| Autentikasi | bcryptjs dan express-session | Password ter-hash dan sesi login sederhana |
| ID tiket unik | crypto.randomUUID() bawaan Node.js | Tanpa library tambahan |
| Alat kerja | VS Code dengan Live Server, Git dan GitHub, Lighthouse di Chrome | Gratis dan umum dipakai |
| Hosting (usulan) | GitHub Pages untuk Fase 1 dan 2, layanan hosting Node.js gratis untuk Fase 3 | Cek ketentuan layanan terbaru sebelum dipakai |

PRD kelompok memakai React, Vite, dan MySQL. Pilihan tersebut tidak diambil karena memerlukan build tool dan waktu belajar tambahan; Wakaloka dapat dipindah ke sana nanti tanpa mengubah alur dan ERD.

## **14\. Pengujian**

* Uji alur utama: login, pilih wisata, check out, order now, dan e-ticket.  
* Uji percabangan: login gagal, produk UMKM tidak dipilih, dan jumlah orang tidak valid.  
* Uji hitung total menggunakan contoh pesanan Rp 215.000 dan minimal dua skenario lain.  
* Uji masa berlaku: tiket pada hari terakhir berlaku diterima dan sehari setelahnya ditolak.  
* Uji validasi: tiket yang sama tidak dapat divalidasi dua kali.  
* Uji tampilan di desktop dan mobile serta uji aksesibilitas dengan Lighthouse dan keyboard.

## **15\. Definisi Selesai**

Sebuah fitur dinyatakan selesai apabila acceptance criteria terpenuhi, pengujian yang relevan lulus, tampilan konsisten dengan palet dan tipografi, tidak ada error pada console browser, dan dokumentasi (PRD serta diagram) diperbarui jika ada perubahan alur atau data.

## **16\. Risiko dan Mitigasi**

| Risiko | Dampak | Mitigasi |
| :---- | :---- | :---- |
| Konten tidak konsisten antarhalaman | Sedang | Satu sumber data destinasi dan UMKM pada Fase 1 |
| Total pembayaran salah hitung | Tinggi | Satu fungsi hitung total dan uji skenario |
| Tiket dipakai berulang | Tinggi | Status tiket dan validasi satu kali |
| Cakupan terlalu besar untuk waktu perkuliahan | Sedang | Kerjakan per fase; P1 ditunda jika waktu tidak cukup |
| Foto berukuran besar memperlambat halaman | Sedang | Kompresi gambar dan ukuran sesuai tampilan |
| Produk UMKM belum tersedia untuk semua destinasi | Rendah | Tampilkan keterangan belum tersedia |

## **17\. Keputusan dan Pertanyaan Terbuka**

| ID | Hal | Status |
| :---- | :---- | :---- |
| D-01 | Fokus pemesanan satu destinasi per pesanan | Usulan |
| D-02 | Pembayaran berupa ringkasan atau simulasi | Usulan |
| D-03 | Masa berlaku tiket 7 hari sejak tanggal kunjungan | Perlu dikonfirmasi |
| D-04 | Teknologi yang digunakan: HTML, CSS, JavaScript, Node.js \+ Express, dan SQLite (lihat bagian 13.4) | Usulan |
| D-05 | Footer menulis Kelompok 8 pada Beranda dan Galeri, tetapi Kelompok 1 pada Profil dan Data | Perlu disamakan |
| D-06 | Alur pada halaman Data menyebut 2 rekomendasi di Home, sedangkan Beranda menampilkan 3 | Perlu disamakan |
| D-07 | Harga tiket Pantai Pulau Anano Rp 159.000 jauh di atas destinasi lain | Perlu diperiksa |
| D-08 | Daftar anggota dan peran kelompok (Profil) menjadi acuan penanggung jawab tiap fase | Usulan |

## **18\. Referensi**

* Use Case Diagram, Class Diagram, Sequence Diagram, dan ERD (notasi Chen) Wakaloka  
* Website statis Wakaloka: Beranda, Profil, Galeri, Data