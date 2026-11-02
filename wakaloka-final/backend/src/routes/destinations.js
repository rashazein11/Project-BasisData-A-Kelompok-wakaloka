import { Router } from 'express';
import { AppError } from '../errors.js';

export default (db) => {
  const r = Router();

  r.get('/', (_req, res) => {
    const umkm = db.prepare('SELECT nama_produk FROM produk_umkm WHERE id_wisata = ?');
    res.json(db.prepare('SELECT * FROM wisata ORDER BY id_wisata').all().map((w) => ({ ...w, umkm: umkm.all(w.id_wisata).map((p) => p.nama_produk) })));
  });

  r.get('/:id', (req, res) => {
    const w = /^\d+$/.test(req.params.id) && db.prepare('SELECT * FROM wisata WHERE id_wisata = ?').get(req.params.id);
    if (!w) throw new AppError(404, 'wisata_tidak_ditemukan', 'Destinasi tidak ditemukan.');
    res.json({ ...w, produk_umkm: db.prepare('SELECT * FROM produk_umkm WHERE id_wisata = ?').all(w.id_wisata) });
  });

  return r;
};
