import { config } from './config.js';
import { openDb } from './db/index.js';
import { createApp } from './app.js';

const app = createApp(openDb(config.dbFile));
app.listen(config.port, () => {
  console.log(`Wakaloka API siap di http://localhost:${config.port}  (dokumentasi: /api-docs)`);
  if (!config.petugasCode) console.log('Catatan: PETUGAS_CODE kosong, pendaftaran petugas dinonaktifkan.');
});
