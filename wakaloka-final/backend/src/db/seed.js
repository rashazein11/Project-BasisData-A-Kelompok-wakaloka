// Data awal destinasi dan produk UMKM (dari desain Figma). Tidak ada akun awal: akun dibuat lewat Daftar.
export const WISATA = [
  ['Tomia Puncak Khayangan', 'Sabana & laut', 'Sabana hijau dan laut lepas di Pulau Tomia. Nikmati panorama saat matahari terbit atau terbenam.', 25000, 5.0, 'assets/img/tomia.jpg'],
  ['Mangrove Sombano', 'Hutan mangrove', 'Alur air di tengah hutan mangrove Sombano, Pulau Kaledupa, untuk mengenal sisi Wakatobi yang tenang.', 25000, 4.7, 'assets/img/mangrove.jpg'],
  ['Pantai Pulau Anano', 'Pantai & pulau', 'Pasir putih dan perairan biru jernih di sekitar pulau kecil Anano.', 59000, 5.0, 'assets/img/anano.jpg'],
  ['Pulau Binongko', 'Pantai & budaya', 'Lanskap karang, perairan dangkal dan deretan kelapa di ujung tenggara Wakatobi.', 50000, 5.0, 'assets/img/binongko.jpg'],
  ['Pulau Hoga', 'Dunia bawah laut', 'Terumbu karang dekat permukaan, air jernih, dan pantai berpasir putih.', 150000, 5.0, 'assets/img/hoga.jpg'],
  ['Goa Kontamale', 'Gua air alami', 'Kolam alami dari batuan kapur dengan air biru kehijauan yang jernih.', 20000, 4.8, 'assets/img/kontamale.jpg'],
];

export function seed(db) {
  if (db.prepare('SELECT COUNT(*) n FROM wisata').get().n > 0) return;
  const ins = db.prepare('INSERT INTO wisata (nama_wisata,kategori,deskripsi,harga_tiket,rating,foto) VALUES (?,?,?,?,?,?)');
  db.transaction(() => {
    WISATA.forEach((w) => ins.run(...w));
    const tomia = db.prepare("SELECT id_wisata FROM wisata WHERE nama_wisata LIKE 'Tomia%'").get().id_wisata;
    db.prepare('INSERT INTO produk_umkm (id_wisata,nama_produk,harga,foto) VALUES (?,?,?,?)').run(tomia, 'Tenun Gelo', 190000, null);
  })();
}
