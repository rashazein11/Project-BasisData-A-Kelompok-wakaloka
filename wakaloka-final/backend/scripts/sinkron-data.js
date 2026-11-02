// Menyamakan data destinasi di database yang SUDAH ada dengan src/db/seed.js (harga, rating, kategori, deskripsi, foto).
// Data awal hanya dimasukkan saat tabel kosong, jadi perubahan seed.js tidak otomatis masuk ke wakaloka.db lama.
// Aman: tidak menyentuh akun, pesanan, maupun tiket (pesanan lama menyimpan harga saat dipesan).
import { config } from '../src/config.js';
import { openDb } from '../src/db/index.js';
import { WISATA } from '../src/db/seed.js';

const db = openDb(config.dbFile);
const upd = db.prepare('UPDATE wisata SET kategori = ?, deskripsi = ?, harga_tiket = ?, rating = ?, foto = ? WHERE nama_wisata = ?');
db.transaction(() => {
  for (const [nama, kategori, deskripsi, harga, rating, foto] of WISATA) {
    const r = upd.run(kategori, deskripsi, harga, rating, foto, nama);
    console.log(`${r.changes ? 'diperbarui' : 'TIDAK DITEMUKAN'}: ${nama} -> Rp ${harga.toLocaleString('id-ID')}`);
  }
})();
