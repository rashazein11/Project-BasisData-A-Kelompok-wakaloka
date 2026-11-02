// Dokumentasi API (OpenAPI 3). Ubah berkas ini setiap kali endpoint berubah; tampil di /api-docs.
const ref = (n) => ({ $ref: `#/components/schemas/${n}` });
const json = (schema) => ({ 'application/json': { schema } });
const body = (schema) => ({ required: true, content: json(schema) });
const ok = (d, s) => ({ description: d, ...(s && { content: json(s) }) });
const err = (d) => ({ description: d, content: json(ref('Galat')) });
const secured = [{ bearerAuth: [] }];
const id = (name, d) => [{ name, in: 'path', required: true, description: d, schema: { type: 'string' } }];
const arr = (s) => ({ type: 'array', items: s });

export const openapi = {
  openapi: '3.0.3',
  info: { title: 'Wakaloka API', version: '1.0.0', description: 'REST API pemesanan tiket wisata Wakatobi dan produk UMKM. Pembayaran hanya simulasi. Klik Authorize dan isi token dari /auth/login untuk mencoba endpoint yang butuh login.' },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Auth' }, { name: 'Destinasi' }, { name: 'Pesanan' }, { name: 'Akun saya' }, { name: 'Petugas' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Galat: { type: 'object', properties: { kode: { type: 'string', example: 'validasi' }, pesan: { type: 'string' }, detail: arr({ type: 'object', properties: { field: { type: 'string' }, pesan: { type: 'string' } } }) } },
      Pengguna: { type: 'object', properties: { id_pengguna: { type: 'integer' }, nama: { type: 'string' }, email: { type: 'string' }, no_telp: { type: 'string' }, role: { type: 'string', enum: ['wisatawan', 'petugas'] } } },
      Wisata: { type: 'object', properties: { id_wisata: { type: 'integer' }, nama_wisata: { type: 'string' }, kategori: { type: 'string' }, deskripsi: { type: 'string' }, harga_tiket: { type: 'integer', example: 25000 }, rating: { type: 'number', example: 5 }, foto: { type: 'string' }, umkm: arr({ type: 'string' }) } },
      Produk: { type: 'object', properties: { id_produk: { type: 'integer' }, id_wisata: { type: 'integer' }, nama_produk: { type: 'string' }, harga: { type: 'integer' }, foto: { type: 'string', nullable: true } } },
      Rincian: { type: 'object', properties: { id_produk: { type: 'integer' }, nama_produk: { type: 'string' }, jumlah: { type: 'integer' }, harga_satuan: { type: 'integer' } } },
      Tiket: { type: 'object', description: 'Status dihitung server: aktif, terpakai, atau kedaluwarsa.', properties: { id_tiket: { type: 'string', format: 'uuid' }, status: { type: 'string', enum: ['aktif', 'terpakai', 'kedaluwarsa'] }, tgl_berlaku: { type: 'string', example: '2026-05-02' }, id_pemesanan: { type: 'integer' }, tgl_pesan: { type: 'string' }, tgl_kunjungan: { type: 'string' }, jumlah_orang: { type: 'integer' }, harga_tiket: { type: 'integer' }, total: { type: 'integer' }, id_wisata: { type: 'integer' }, nama_wisata: { type: 'string' }, kategori: { type: 'string' }, foto: { type: 'string' }, pemilik: { type: 'string' }, email: { type: 'string' }, rincian: arr(ref('Rincian')) } },
      PesananBaru: { type: 'object', properties: { pesanan: { type: 'object' }, rincian: arr(ref('Rincian')), tiket: { type: 'object', properties: { id_tiket: { type: 'string' }, status: { type: 'string' }, tgl_berlaku: { type: 'string' } } } } },
    },
  },
  paths: {
    '/auth/register': { post: { tags: ['Auth'], summary: 'Daftar akun baru', description: 'Peran petugas wajib menyertakan kode_petugas dari pengelola loket.', requestBody: body({ type: 'object', required: ['nama', 'email', 'no_telp', 'password'], properties: { nama: { type: 'string', example: 'Budi Hajar' }, email: { type: 'string', example: 'budi@gmail.com' }, no_telp: { type: 'string', example: '08123456789' }, password: { type: 'string', minLength: 8 }, role: { type: 'string', enum: ['wisatawan', 'petugas'], default: 'wisatawan' }, kode_petugas: { type: 'string' } } }), responses: { 201: ok('Akun dibuat', ref('Pengguna')), 400: err('Data tidak valid'), 403: err('Kode petugas salah'), 409: err('Email atau telepon sudah terdaftar') } } },
    '/auth/login': { post: { tags: ['Auth'], summary: 'Masuk', requestBody: body({ type: 'object', required: ['identitas', 'password'], properties: { identitas: { type: 'string', description: 'Email atau nomor telepon' }, password: { type: 'string' } } }), responses: { 200: ok('Token dan data akun', { type: 'object', properties: { token: { type: 'string' }, pengguna: ref('Pengguna') } }), 401: err('Identitas atau kata sandi tidak sesuai') } } },
    '/me': { get: { tags: ['Akun saya'], summary: 'Data akun yang sedang masuk', security: secured, responses: { 200: ok('Data akun', ref('Pengguna')), 401: err('Belum masuk') } } },
    '/destinations': { get: { tags: ['Destinasi'], summary: 'Daftar enam destinasi', responses: { 200: ok('Daftar destinasi', arr(ref('Wisata'))) } } },
    '/destinations/{id}': { get: { tags: ['Destinasi'], summary: 'Detail destinasi dan produk UMKM-nya', parameters: id('id', 'id_wisata'), responses: { 200: ok('Detail', { allOf: [ref('Wisata'), { type: 'object', properties: { produk_umkm: arr(ref('Produk')) } }] }), 404: err('Tidak ditemukan') } } },
    '/orders': { post: { tags: ['Pesanan'], summary: 'Buat pesanan dan tiket', description: 'Server menghitung total: harga tiket x jumlah orang + jumlah (harga produk x jumlah). Tiket berlaku 7 hari sejak tanggal kunjungan.', security: secured, requestBody: body({ type: 'object', required: ['id_wisata', 'tgl_kunjungan', 'jumlah_orang'], properties: { id_wisata: { type: 'integer', example: 1 }, tgl_kunjungan: { type: 'string', example: '2026-12-25' }, jumlah_orang: { type: 'integer', example: 1 }, produk: arr({ type: 'object', properties: { id_produk: { type: 'integer', example: 1 }, jumlah: { type: 'integer', example: 1 } } }) } }), responses: { 201: ok('Pesanan dan tiket dibuat', ref('PesananBaru')), 400: err('Data tidak valid atau produk bukan milik destinasi'), 401: err('Belum masuk'), 403: err('Bukan wisatawan'), 404: err('Destinasi tidak ditemukan') } } },
    '/me/orders': { get: { tags: ['Akun saya'], summary: 'Riwayat pesanan milik sendiri', security: secured, responses: { 200: ok('Daftar', arr(ref('Tiket'))), 401: err('Belum masuk'), 403: err('Bukan wisatawan') } } },
    '/me/tickets': { get: { tags: ['Akun saya'], summary: 'Daftar tiket milik sendiri', security: secured, responses: { 200: ok('Daftar', arr(ref('Tiket'))), 401: err('Belum masuk'), 403: err('Bukan wisatawan') } } },
    '/me/tickets/{id}': { get: { tags: ['Akun saya'], summary: 'E-tiket lengkap milik sendiri', security: secured, parameters: id('id', 'id_tiket (UUID)'), responses: { 200: ok('E-tiket', ref('Tiket')), 401: err('Belum masuk'), 404: err('Tidak ditemukan atau bukan milik Anda') } } },
    '/staff/tickets/{id}': { get: { tags: ['Petugas'], summary: 'Cari tiket (tidak mengubah status)', security: secured, parameters: id('id', 'id_tiket (UUID)'), responses: { 200: ok('Info tiket', ref('Tiket')), 401: err('Belum masuk'), 403: err('Bukan petugas'), 404: err('Tidak ditemukan') } } },
    '/staff/tickets/{id}/validate': { post: { tags: ['Petugas'], summary: 'Validasi tiket (sekali pakai, atomik)', security: secured, parameters: id('id', 'id_tiket (UUID)'), responses: { 200: ok('Tiket terpakai', { type: 'object', properties: { id_tiket: { type: 'string' }, status: { type: 'string', example: 'terpakai' } } }), 401: err('Belum masuk'), 403: err('Bukan petugas'), 404: err('Tidak ditemukan'), 409: err('Sudah digunakan'), 422: err('Kedaluwarsa') } } },
  },
};
