const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const utc = (s) => new Date(`${s}T00:00:00Z`);

export const rp = (n) => `Rp ${String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
export const bintang = (r) => `★ ${Number(r).toFixed(1).replace('.', ',')}`;
export const tgl = (s) => { const d = utc(s); return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
export const tglPendek = (s) => { const d = utc(s); return `${HARI[d.getUTCDay()]} ${d.getUTCDate()}/${d.getUTCMonth() + 1}`; };
export const hariIni = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); // tanggal di WIB
export const tambahHari = (s, n) => { const d = utc(s); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export const STATUS = { aktif: 'Belum digunakan', terpakai: 'Sudah digunakan', kedaluwarsa: 'Kedaluwarsa' };
