import { AppError } from '../errors.js';

export const hariIni = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }); // YYYY-MM-DD
export const tambahHari = (tgl, n) => {
  const d = new Date(`${tgl}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
// Kedaluwarsa tidak disimpan: dihitung dari tanggal, jadi tidak perlu penjadwal.
export const statusTerhitung = (t, today = hariIni()) =>
  t.status_tiket === 'terpakai' ? 'terpakai' : today > t.tgl_berlaku ? 'kedaluwarsa' : 'aktif';

const SELECT = `SELECT t.id_tiket, t.status_tiket, t.tgl_berlaku,
  p.id_pemesanan, p.tgl_pesan, p.tgl_kunjungan, p.jumlah_orang, p.harga_tiket, p.total,
  w.id_wisata, w.nama_wisata, w.kategori, w.foto, u.id_pengguna, u.nama AS pemilik, u.email
  FROM tiket t JOIN pemesanan p ON p.id_pemesanan = t.id_pemesanan
  JOIN wisata w ON w.id_wisata = p.id_wisata JOIN pengguna u ON u.id_pengguna = p.id_pengguna`;

function lengkapi(db, row) {
  const { status_tiket, ...rest } = row;
  const rincian = db
    .prepare(`SELECT d.id_produk, k.nama_produk, d.jumlah, d.harga_satuan FROM detail_produk_pesanan d
      JOIN produk_umkm k ON k.id_produk = d.id_produk WHERE d.id_pemesanan = ?`)
    .all(row.id_pemesanan);
  return { ...rest, status: statusTerhitung(row), rincian };
}

export function tiketById(db, id, idPengguna) {
  const row = idPengguna
    ? db.prepare(`${SELECT} WHERE t.id_tiket = ? AND u.id_pengguna = ?`).get(id, idPengguna)
    : db.prepare(`${SELECT} WHERE t.id_tiket = ?`).get(id);
  return row ? lengkapi(db, row) : null;
}

export const tiketMilik = (db, idPengguna) =>
  db.prepare(`${SELECT} WHERE u.id_pengguna = ? ORDER BY p.id_pemesanan DESC`).all(idPengguna).map((r) => lengkapi(db, r));

// Satu UPDATE bersyarat = atomik: dua petugas bersamaan, hanya satu yang berhasil.
export function validasiTiket(db, id) {
  const r = db
    .prepare("UPDATE tiket SET status_tiket = 'terpakai' WHERE id_tiket = ? AND status_tiket = 'aktif' AND tgl_berlaku >= ?")
    .run(id, hariIni());
  if (r.changes === 1) return tiketById(db, id);
  const t = db.prepare('SELECT status_tiket FROM tiket WHERE id_tiket = ?').get(id);
  if (!t) throw new AppError(404, 'tiket_tidak_ditemukan', 'Tiket tidak ditemukan.');
  if (t.status_tiket === 'terpakai') throw new AppError(409, 'tiket_sudah_dipakai', 'Tiket sudah digunakan.');
  throw new AppError(422, 'tiket_kedaluwarsa', 'Tiket sudah kedaluwarsa.');
}
