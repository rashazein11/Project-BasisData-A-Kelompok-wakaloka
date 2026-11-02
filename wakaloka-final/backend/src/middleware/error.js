import { AppError } from '../errors.js';

export const notFound = (_req, res) => res.status(404).json({ kode: 'tidak_ada', pesan: 'Alamat tidak ditemukan.' });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) return res.status(err.status).json({ kode: err.kode, pesan: err.message, detail: err.detail });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ kode: 'json_rusak', pesan: 'Isi permintaan bukan JSON yang valid.' });
  console.error(err);
  res.status(500).json({ kode: 'galat_server', pesan: 'Terjadi kesalahan di server.' });
}

// Express 4 tidak menangkap galat async sendiri.
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
