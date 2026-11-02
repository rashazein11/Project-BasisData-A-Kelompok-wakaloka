import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

// Ikon (24x24, garis 2) sama dengan komponen "Tab bawah" di Figma.
const IKON = {
  home: <><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /></>,
  ticket: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></>,
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  check: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
};
// Layar utama yang menampilkan tab bawah di lebar HP (sama dengan desain Figma); layar tugas (detail, checkout, e-tiket) tidak.
export const LAYAR_TAB = ['beranda', 'jelajah', 'galeri', 'data', 'riwayat', 'akun', 'validasi'];

export default function TabBawah({ seg }) {
  const { user } = useAuth();
  const petugas = user?.role === 'petugas';
  const tabs = [
    ['/beranda', 'Beranda', 'home', seg === 'beranda'],
    ['/jelajah', 'Jelajah', 'compass', seg === 'jelajah'],
    petugas ? ['/validasi', 'Validasi', 'check', seg === 'validasi'] : ['/riwayat', 'Tiket saya', 'ticket', seg === 'riwayat'],
    ['/akun', 'Akun', 'user', seg === 'akun'],
  ];
  return (
    <nav className="tabbar" aria-label="Navigasi bawah">
      {tabs.map(([to, label, ikon, on]) => (
        <Link key={to} to={to} aria-current={on ? 'page' : undefined}>
          <span className="pill"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{IKON[ikon]}</svg></span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
