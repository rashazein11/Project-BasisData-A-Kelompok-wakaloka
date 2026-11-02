import { randomUUID } from 'node:crypto';
import { AppError } from '../errors.js';
import { hariIni, tambahHari } from './tickets.js';

// Semua harga diambil dari database, tidak pernah dari frontend (BR-03).
export function buatPesanan(db, idPengguna, b) {
  return db.transaction(() => {
    const w = db.prepare('SELECT * FROM wisata WHERE id_wisata = ?').get(b.id_wisata);
    if (!w) throw new AppError(404, 'wisata_tidak_ditemukan', 'Destinasi tidak ditemukan.');

    const rincian = b.produk.map(({ id_produk, jumlah }) => {
      const p = db.prepare('SELECT * FROM produk_umkm WHERE id_produk = ? AND id_wisata = ?').get(id_produk, w.id_wisata);
      if (!p) throw new AppError(400, 'produk_tidak_sesuai', 'Produk UMKM tidak tersedia di destinasi ini.');
      return { id_produk, nama_produk: p.nama_produk, jumlah, harga_satuan: p.harga };
    });
    const total = w.harga_tiket * b.jumlah_orang + rincian.reduce((s, r) => s + r.harga_satuan * r.jumlah, 0);

    const tgl_pesan = hariIni();
    const { lastInsertRowid: idPesan } = db
      .prepare(`INSERT INTO pemesanan (id_pengguna, id_wisata, tgl_pesan, tgl_kunjungan, jumlah_orang, harga_tiket, total)
        VALUES (?,?,?,?,?,?,?)`)
      .run(idPengguna, w.id_wisata, tgl_pesan, b.tgl_kunjungan, b.jumlah_orang, w.harga_tiket, total);
    const insDetail = db.prepare('INSERT INTO detail_produk_pesanan (id_pemesanan, id_produk, jumlah, harga_satuan) VALUES (?,?,?,?)');
    rincian.forEach((r) => insDetail.run(idPesan, r.id_produk, r.jumlah, r.harga_satuan));

    const tiket = { id_tiket: randomUUID(), status: 'aktif', tgl_berlaku: tambahHari(b.tgl_kunjungan, 7) }; // BR-04
    db.prepare('INSERT INTO tiket (id_tiket, id_pemesanan, status_tiket, tgl_berlaku) VALUES (?,?,?,?)').run(tiket.id_tiket, idPesan, 'aktif', tiket.tgl_berlaku);

    return {
      pesanan: { id_pemesanan: idPesan, id_wisata: w.id_wisata, nama_wisata: w.nama_wisata, tgl_pesan, tgl_kunjungan: b.tgl_kunjungan, jumlah_orang: b.jumlah_orang, harga_tiket: w.harga_tiket, total },
      rincian,
      tiket,
    };
  })();
}
