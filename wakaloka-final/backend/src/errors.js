// Galat yang boleh ditampilkan ke pengguna; sisanya menjadi 500 generik.
export class AppError extends Error {
  constructor(status, kode, pesan, detail) {
    super(pesan);
    Object.assign(this, { status, kode, detail });
  }
}
