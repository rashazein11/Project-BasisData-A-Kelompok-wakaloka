import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './config.js';
import { openapi } from '../openapi/openapi.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import orderRoutes from './routes/orders.js';
import meRoutes from './routes/me.js';
import staffRoutes from './routes/staff.js';

export function createApp(db, { limiter = true } = {}) {
  const app = express();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi)); // sebelum helmet: UI Swagger memakai skrip inline
  app.use(helmet());
  app.use(cors({ origin: config.origins }));
  app.use(express.json({ limit: '10kb' }));

  if (limiter) app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { kode: 'terlalu_banyak', pesan: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' } }));

  app.use('/api/auth', authRoutes(db));
  app.use('/api/destinations', destinationRoutes(db));
  app.use('/api/orders', orderRoutes(db));
  app.use('/api/me', meRoutes(db));
  app.use('/api/staff', staffRoutes(db));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
