import { Router } from 'express';
import { AppError } from '../errors.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { tiketById, tiketMilik } from '../services/tickets.js';

export default (db) => {
  const r = Router();
  r.use(authenticate);

  r.get('/', (req, res) => {
    const u = db.prepare('SELECT id_pengguna, nama, email, no_telp, role FROM pengguna WHERE id_pengguna = ?').get(req.user.id);
    if (!u) throw new AppError(401, 'token_tidak_valid', 'Sesi berakhir. Silakan masuk lagi.');
    res.json(u);
  });

  // Satu pesanan = satu tiket, jadi riwayat pesanan dan daftar tiket memakai data yang sama.
  r.get('/orders', requireRole('wisatawan'), (req, res) => res.json(tiketMilik(db, req.user.id)));
  r.get('/tickets', requireRole('wisatawan'), (req, res) => res.json(tiketMilik(db, req.user.id)));
  r.get('/tickets/:id', requireRole('wisatawan'), (req, res) => {
    const t = tiketById(db, req.params.id, req.user.id); // milik orang lain = 404, bukan 403
    if (!t) throw new AppError(404, 'tiket_tidak_ditemukan', 'Tiket tidak ditemukan.');
    res.json(t);
  });
  return r;
};
