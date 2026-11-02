import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.PETUGAS_CODE = 'KODE-TES';
process.env.JWT_SECRET = 'rahasia-tes';
const { openDb } = await import('../src/db/index.js');
const { createApp } = await import('../src/app.js');
const { hariIni, tambahHari } = await import('../src/services/tickets.js');

let server, base, db;
before(async () => {
  db = openDb(':memory:');
  server = createApp(db, { limiter: false }).listen(0);
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(() => server.close());

const call = async (method, path, { token, body } = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token && { authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => null) };
};
let n = 0;
async function akun(role = 'wisatawan') {
  n++;
  const body = { nama: `Pengguna ${n}`, email: `u${n}@mail.com`, no_telp: `0812000${String(n).padStart(4, '0')}`, password: 'rahasia123', role, ...(role === 'petugas' && { kode_petugas: 'KODE-TES' }) };
  assert.equal((await call('POST', '/auth/register', { body })).status, 201);
  return (await call('POST', '/auth/login', { body: { identitas: body.email, password: body.password } })).data.token;
}
const besok = tambahHari(hariIni(), 1);
const pesan = (token, id_wisata, jumlah_orang, produk = [], tgl_kunjungan = besok) =>
  call('POST', '/orders', { token, body: { id_wisata, tgl_kunjungan, jumlah_orang, produk } });

test('daftar: validasi, duplikat, dan kode petugas', async () => {
  const ok = { nama: 'Budi', email: 'Budi@Mail.com', no_telp: '+62 812-9999-0001', password: 'rahasia123' };
  const r = await call('POST', '/auth/register', { body: ok });
  assert.equal(r.status, 201);
  assert.equal(r.data.email, 'budi@mail.com');
  assert.equal(r.data.no_telp, '081299990001');
  assert.equal(r.data.role, 'wisatawan');
  assert.equal(JSON.stringify(r.data).includes('password'), false);
  assert.equal((await call('POST', '/auth/register', { body: { ...ok, no_telp: '081299990002' } })).status, 409); // email ganda
  assert.equal((await call('POST', '/auth/register', { body: { ...ok, email: 'lain@mail.com' } })).status, 409); // telepon ganda
  const pendek = await call('POST', '/auth/register', { body: { ...ok, email: 'x@mail.com', no_telp: '081299990003', password: '123' } });
  assert.equal(pendek.status, 400);
  assert.equal(pendek.data.detail[0].field, 'password');
  const base2 = { ...ok, email: 'p@mail.com', no_telp: '081299990004', role: 'petugas' };
  assert.equal((await call('POST', '/auth/register', { body: base2 })).status, 403); // tanpa kode
  assert.equal((await call('POST', '/auth/register', { body: { ...base2, kode_petugas: 'salah' } })).status, 403);
  assert.equal((await call('POST', '/auth/register', { body: { ...base2, kode_petugas: 'KODE-TES' } })).status, 201);
});

test('login: pesan gagal sama untuk akun tidak ada dan sandi salah', async () => {
  await akun();
  const a = await call('POST', '/auth/login', { body: { identitas: 'tidakada@mail.com', password: 'rahasia123' } });
  const b = await call('POST', '/auth/login', { body: { identitas: `u${n}@mail.com`, password: 'salahsalah' } });
  assert.equal(a.status, 401);
  assert.equal(b.status, 401);
  assert.equal(a.data.pesan, b.data.pesan);
  const telp = await call('POST', '/auth/login', { body: { identitas: `0812000${String(n).padStart(4, '0')}`, password: 'rahasia123' } });
  assert.equal(telp.status, 200); // login dengan nomor telepon
});

test('destinasi: enam tempat, detail membawa produk UMKM, 404 untuk id tidak ada', async () => {
  const l = await call('GET', '/destinations');
  assert.equal(l.data.length, 6);
  const tomia = l.data.find((w) => w.nama_wisata.startsWith('Tomia'));
  assert.deepEqual(tomia.umkm, ['Tenun Gelo']);
  assert.equal((await call('GET', `/destinations/${tomia.id_wisata}`)).data.produk_umkm[0].harga, 190000);
  assert.equal((await call('GET', '/destinations/999')).status, 404);
  assert.equal((await call('GET', '/destinations/abc')).status, 404);
});

// Skenario uji total (PRD bagian 14 / Figma Checkout A-I)
const skenario = [
  ['A Tomia 1 orang + 1 Tenun', 'Tomia', 1, 1, 215000],
  ['B Tomia 1 orang tanpa UMKM', 'Tomia', 1, 0, 25000],
  ['C Tomia 2 orang + 1 Tenun', 'Tomia', 2, 1, 240000],
  ['D Tomia 3 orang + 2 Tenun', 'Tomia', 3, 2, 455000],
  ['E Mangrove 3 orang', 'Mangrove', 3, 0, 75000],
  ['F Anano 2 orang', 'Pantai Pulau Anano', 2, 0, 118000],
  ['G Binongko 5 orang', 'Pulau Binongko', 5, 0, 250000],
  ['H Hoga 4 orang', 'Pulau Hoga', 4, 0, 600000],
  ['I Kontamale 2 orang', 'Goa', 2, 0, 40000],
];
for (const [nama, kunci, orang, tenun, total] of skenario) {
  test(`pesanan: ${nama} = Rp ${total}`, async () => {
    const token = await akun();
    const w = db.prepare('SELECT id_wisata FROM wisata WHERE nama_wisata LIKE ?').get(`${kunci}%`);
    const produk = tenun ? [{ id_produk: db.prepare('SELECT id_produk FROM produk_umkm').get().id_produk, jumlah: tenun }] : [];
    const r = await pesan(token, w.id_wisata, orang, produk, '2099-04-25');
    assert.equal(r.status, 201);
    assert.equal(r.data.pesanan.total, total);
    assert.equal(r.data.tiket.tgl_berlaku, '2099-05-02'); // 25 April + 7 hari = 2 Mei (contoh PRD)
    assert.match(r.data.tiket.id_tiket, /^[0-9a-f-]{36}$/);
  });
}

test('pesanan: validasi, produk bukan milik destinasi, dan hak akses', async () => {
  const token = await akun();
  const petugas = await akun('petugas');
  assert.equal((await pesan(token, 1, 0)).status, 400); // minimal 1 orang
  assert.equal((await pesan(token, 1, 1, [], '')).status, 400); // tanggal wajib
  assert.equal((await pesan(token, 1, 1, [], '2020-01-01')).status, 400); // tanggal lampau
  assert.equal((await pesan(token, 1, 1, [], '2026-02-30')).status, 400); // tanggal tidak ada
  assert.equal((await pesan(token, 2, 1, [{ id_produk: 1, jumlah: 1 }])).status, 400); // Tenun milik Tomia, bukan Mangrove
  assert.equal((await pesan(token, 999, 1)).status, 404);
  assert.equal((await pesan(petugas, 1, 1)).status, 403);
  assert.equal((await call('POST', '/orders', { body: {} })).status, 401);
  const harga = await call('POST', '/orders', { token, body: { id_wisata: 1, tgl_kunjungan: besok, jumlah_orang: 1, total: 1, harga_tiket: 1 } });
  assert.equal(harga.data.pesanan.total, 25000); // harga dari frontend diabaikan
});

test('riwayat dan e-tiket hanya milik sendiri', async () => {
  const a = await akun(), b = await akun();
  const p = await pesan(a, 1, 2);
  const id = p.data.tiket.id_tiket;
  assert.equal((await call('GET', '/me/orders', { token: a })).data.length >= 1, true);
  assert.equal((await call('GET', '/me/orders', { token: b })).data.length, 0);
  assert.equal((await call('GET', `/me/tickets/${id}`, { token: a })).data.pemilik.startsWith('Pengguna'), true);
  assert.equal((await call('GET', `/me/tickets/${id}`, { token: b })).status, 404); // milik orang lain
  assert.equal((await call('GET', '/me', { token: a })).data.role, 'wisatawan');
  assert.equal((await call('GET', '/me')).status, 401);
});

test('petugas: cari tidak mengubah status, validasi hanya sekali', async () => {
  const w = await akun(), petugas = await akun('petugas');
  const id = (await pesan(w, 1, 1)).data.tiket.id_tiket;
  assert.equal((await call('GET', `/staff/tickets/${id}`, { token: w })).status, 403); // wisatawan dilarang
  assert.equal((await call('GET', `/staff/tickets/${id}`, { token: petugas })).data.status, 'aktif');
  assert.equal((await call('GET', `/staff/tickets/${id}`, { token: petugas })).data.status, 'aktif'); // dicari lagi, tetap aktif
  assert.equal((await call('POST', `/staff/tickets/${id}/validate`, { token: petugas })).data.status, 'terpakai');
  assert.equal((await call('POST', `/staff/tickets/${id}/validate`, { token: petugas })).status, 409);
  assert.equal((await call('GET', `/me/tickets/${id}`, { token: w })).data.status, 'terpakai');
  assert.equal((await call('POST', '/staff/tickets/tidak-ada/validate', { token: petugas })).status, 404);
});

test('petugas: tiket kedaluwarsa ditolak; dua validasi bersamaan hanya satu berhasil', async () => {
  const w = await akun(), petugas = await akun('petugas');
  const lama = (await pesan(w, 1, 1)).data.tiket.id_tiket;
  db.prepare('UPDATE tiket SET tgl_berlaku = ? WHERE id_tiket = ?').run(tambahHari(hariIni(), -1), lama);
  assert.equal((await call('GET', `/staff/tickets/${lama}`, { token: petugas })).data.status, 'kedaluwarsa');
  assert.equal((await call('POST', `/staff/tickets/${lama}/validate`, { token: petugas })).status, 422);
  const id = (await pesan(w, 1, 1)).data.tiket.id_tiket;
  const hasil = await Promise.all([1, 2, 3].map(() => call('POST', `/staff/tickets/${id}/validate`, { token: petugas })));
  assert.equal(hasil.filter((r) => r.status === 200).length, 1);
});

test('hari terakhir masa berlaku masih diterima (inklusif)', async () => {
  const w = await akun(), petugas = await akun('petugas');
  const id = (await pesan(w, 1, 1)).data.tiket.id_tiket;
  db.prepare('UPDATE tiket SET tgl_berlaku = ? WHERE id_tiket = ?').run(hariIni(), id);
  assert.equal((await call('POST', `/staff/tickets/${id}/validate`, { token: petugas })).status, 200);
});
