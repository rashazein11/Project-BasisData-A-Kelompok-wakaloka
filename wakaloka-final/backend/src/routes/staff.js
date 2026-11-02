import { Router } from 'express';
import { AppError } from '../errors.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { tiketById, validasiTiket } from '../services/tickets.js';

export default (db) => {
  const r = Router();
  r.use(authenticate, requireRole('petugas'));

  // Pencarian hanya membaca; status tidak berubah sampai validate dipanggil.
  r.get('/tickets/:id', (req, res) => {
    const t = tiketById(db, req.params.id);
    if (!t) throw new AppError(404, 'tiket_tidak_ditemukan', 'Tiket tidak ditemukan.');
    res.json(t);
  });
  r.post('/tickets/:id/validate', (req, res) => {
    const t = validasiTiket(db, req.params.id);
    res.json({ id_tiket: t.id_tiket, status: t.status });
  });
  return r;
};
