export const rp = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;
export const bintang = (r) => `★ ${Number(r).toFixed(1).replace('.', ',')}`;
export const tgl = (s) => new Date(`${s}T00:00:00Z`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const hariIni = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
export const tambahHari = (s, n) => { const d = new Date(`${s}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export const STATUS = { aktif: 'Belum digunakan', terpakai: 'Sudah digunakan', kedaluwarsa: 'Kedaluwarsa' };
