import { Router } from 'express';
import { timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { config } from '../config.js';
import { AppError } from '../errors.js';
import { signToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { wrap } from '../middleware/error.js';

// +62812... / 62812... / 0812... disimpan seragam sebagai 0812... agar keunikan nomor akurat.
const telp = (s) => s.replace(/[\s-]/g, '').replace(/^(\+62|62)/, '0');

const registerSchema = z.object({
  nama: z.string().trim().min(1, 'Nama wajib diisi.').max(100, 'Nama maksimal 100 karakter.'),
  email: z.string().trim().toLowerCase().pipe(z.email('Format email tidak valid.')),
  no_telp: z.string().transform(telp).pipe(z.string().regex(/^08\d{8,11}$/, 'Nomor telepon tidak valid (contoh 08123456789).')),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter.').max(72, 'Kata sandi maksimal 72 karakter.'),
  role: z.enum(['wisatawan', 'petugas'], 'Peran harus wisatawan atau petugas.').default('wisatawan'),
  kode_petugas: z.string().optional(),
});
const loginSchema = z.object({ identitas: z.string().trim().min(1, 'Wajib diisi.'), password: z.string().min(1, 'Wajib diisi.') });

const sama = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const DUMMY_HASH = bcrypt.hashSync('tidak-dipakai', 10); // agar waktu respons sama untuk akun yang tidak ada

export default (db) => {
  const r = Router();

  r.post('/register', validate(registerSchema), wrap(async (req, res) => {
    const { nama, email, no_telp, password, role, kode_petugas } = req.body;
    if (role === 'petugas' && !(config.petugasCode && kode_petugas && sama(kode_petugas, config.petugasCode)))
      throw new AppError(403, 'kode_petugas_salah', 'Kode petugas tidak sesuai. Hubungi pengelola loket.');
    const hash = await bcrypt.hash(password, 10);
    try {
      const { lastInsertRowid } = db
        .prepare('INSERT INTO pengguna (nama, email, no_telp, password_hash, role) VALUES (?,?,?,?,?)')
        .run(nama, email, no_telp, hash, role);
      res.status(201).json({ id_pengguna: lastInsertRowid, nama, email, no_telp, role });
    } catch (e) {
      if (e.code !== 'SQLITE_CONSTRAINT_UNIQUE') throw e;
      const email_dup = String(e.message).includes('email');
      throw new AppError(409, 'sudah_terdaftar', email_dup ? 'Email ini sudah terdaftar. Gunakan email lain atau masuk.' : 'Nomor telepon ini sudah terdaftar.', [{ field: email_dup ? 'email' : 'no_telp', pesan: 'Sudah terdaftar.' }]);
    }
  }));

  r.post('/login', validate(loginSchema), wrap(async (req, res) => {
    const { identitas, password } = req.body;
    const u = db.prepare('SELECT * FROM pengguna WHERE email = ? OR no_telp = ?').get(identitas.toLowerCase(), telp(identitas));
    const ok = await bcrypt.compare(password, u ? u.password_hash : DUMMY_HASH);
    if (!u || !ok) throw new AppError(401, 'login_gagal', 'Identitas atau kata sandi tidak sesuai.'); // sengaja umum
    res.json({ token: signToken(u), pengguna: { id_pengguna: u.id_pengguna, nama: u.nama, email: u.email, role: u.role } });
  }));

  return r;
};
