CREATE TABLE IF NOT EXISTS pengguna (
  id_pengguna   INTEGER PRIMARY KEY AUTOINCREMENT,
  nama          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  no_telp       TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'wisatawan' CHECK (role IN ('wisatawan','petugas'))
);

CREATE TABLE IF NOT EXISTS wisata (
  id_wisata   INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_wisata TEXT NOT NULL UNIQUE,
  kategori    TEXT NOT NULL,
  deskripsi   TEXT NOT NULL,
  harga_tiket INTEGER NOT NULL CHECK (harga_tiket >= 0),
  rating      REAL CHECK (rating BETWEEN 0 AND 5),
  foto        TEXT
);

CREATE TABLE IF NOT EXISTS produk_umkm (
  id_produk   INTEGER PRIMARY KEY AUTOINCREMENT,
  id_wisata   INTEGER NOT NULL REFERENCES wisata(id_wisata),
  nama_produk TEXT NOT NULL,
  harga       INTEGER NOT NULL CHECK (harga >= 0),
  foto        TEXT
);

CREATE TABLE IF NOT EXISTS pemesanan (
  id_pemesanan  INTEGER PRIMARY KEY AUTOINCREMENT,
  id_pengguna   INTEGER NOT NULL REFERENCES pengguna(id_pengguna),
  id_wisata     INTEGER NOT NULL REFERENCES wisata(id_wisata),
  tgl_pesan     TEXT NOT NULL,
  tgl_kunjungan TEXT NOT NULL,
  jumlah_orang  INTEGER NOT NULL CHECK (jumlah_orang >= 1),
  harga_tiket   INTEGER NOT NULL,
  total         INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pemesanan_pengguna ON pemesanan(id_pengguna);

CREATE TABLE IF NOT EXISTS tiket (
  id_tiket     TEXT PRIMARY KEY,
  id_pemesanan INTEGER NOT NULL UNIQUE REFERENCES pemesanan(id_pemesanan),
  status_tiket TEXT NOT NULL DEFAULT 'aktif' CHECK (status_tiket IN ('aktif','terpakai')),
  tgl_berlaku  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS detail_produk_pesanan (
  id_pemesanan INTEGER NOT NULL REFERENCES pemesanan(id_pemesanan),
  id_produk    INTEGER NOT NULL REFERENCES produk_umkm(id_produk),
  jumlah       INTEGER NOT NULL CHECK (jumlah >= 1),
  harga_satuan INTEGER NOT NULL,
  PRIMARY KEY (id_pemesanan, id_produk)
);
CREATE INDEX IF NOT EXISTS idx_produk_wisata ON produk_umkm(id_wisata);
