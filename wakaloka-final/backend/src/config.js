import 'dotenv/config';

const prod = process.env.NODE_ENV === 'production';
if (prod && !process.env.JWT_SECRET) throw new Error('JWT_SECRET wajib diisi di .env');

export const config = {
  port: Number(process.env.PORT) || 3000,
  // shortcut: nilai bawaan hanya untuk pengembangan lokal; produksi wajib mengisi JWT_SECRET.
  jwtSecret: process.env.JWT_SECRET || 'rahasia-lokal-jangan-dipakai-di-produksi',
  petugasCode: process.env.PETUGAS_CODE || '',
  origins: (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(','),
  dbFile: process.env.DB_FILE || './wakaloka.db',
};
