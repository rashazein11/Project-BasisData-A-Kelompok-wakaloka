import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { buatPesanan } from '../services/orders.js';
import { hariIni } from '../services/tickets.js';

const tanggal = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus TTTT-BB-HH.')
  .refine((s) => { const d = new Date(`${s}T00:00:00Z`); return !isNaN(d) && d.toISOString().slice(0, 10) === s; }, 'Tanggal tidak valid.')
  .refine((s) => s >= hariIni(), 'Tanggal kunjungan tidak boleh sebelum hari ini.');

const orderSchema = z.object({
  id_wisata: z.number('Destinasi wajib dipilih.').int().positive('Destinasi wajib dipilih.'),
  tgl_kunjungan: tanggal,
  jumlah_orang: z.number('Jumlah orang wajib diisi.').int('Jumlah harus bilangan bulat.').min(1, 'Minimal 1 orang.').max(50, 'Maksimal 50 orang.'),
  produk: z.array(z.object({
    id_produk: z.number().int().positive(),
    jumlah: z.number().int().min(1, 'Jumlah produk minimal 1.').max(20, 'Jumlah produk maksimal 20.'),
  })).default([]).refine((a) => new Set(a.map((p) => p.id_produk)).size === a.length, 'Produk tidak boleh ganda.'),
});

export default (db) => {
  const r = Router();
  r.post('/', authenticate, requireRole('wisatawan'), validate(orderSchema), (req, res) => {
    res.status(201).json(buatPesanan(db, req.user.id, req.body));
  });
  return r;
};
