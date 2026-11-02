import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { AppError } from '../errors.js';

export function authenticate(req, _res, next) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) throw new AppError(401, 'tidak_login', 'Silakan masuk terlebih dahulu.');
  try {
    req.user = jwt.verify(h.slice(7), config.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new AppError(401, 'token_tidak_valid', 'Sesi berakhir. Silakan masuk lagi.');
  }
  next();
}

export const requireRole = (role) => (req, _res, next) => {
  if (req.user.role !== role) throw new AppError(403, 'dilarang', `Akses ini hanya untuk ${role}.`);
  next();
};

export const signToken = (u) =>
  jwt.sign({ id: u.id_pengguna, role: u.role }, config.jwtSecret, { algorithm: 'HS256', expiresIn: '8h' });
