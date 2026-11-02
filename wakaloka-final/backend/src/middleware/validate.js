import { AppError } from '../errors.js';

export const validate = (schema) => (req, _res, next) => {
  const r = schema.safeParse(req.body ?? {});
  if (!r.success) {
    const detail = r.error.issues.map((i) => ({ field: i.path.join('.'), pesan: i.message }));
    throw new AppError(400, 'validasi', 'Data tidak valid.', detail);
  }
  req.body = r.data;
  next();
};
