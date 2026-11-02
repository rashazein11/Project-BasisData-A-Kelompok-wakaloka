import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { Logo } from './ui.jsx';

const ACTIVE = { destinasi: 'jelajah', checkout: 'jelajah', tiket: 'riwayat' }; // layar turunan menyalakan menu induknya

export default function Header() {
  const { user } = useAuth();
  const seg = useLocation().pathname.split('/')[1];
  const active = ACTIVE[seg] || seg;
  const cur = (k) => (active === k ? 'page' : undefined);
  const petugas = user?.role === 'petugas';
  const [open, setOpen] = useState(false);
  const opener = useRef(null), closer = useRef(null);
  useEffect(() => { if (open) closer.current.focus(); }, [open]);
  const tutup = () => { setOpen(false); opener.current.focus(); };
  const tiket = petugas ? ['/validasi', 'Validasi', 'validasi'] : ['/riwayat', 'Tiket saya', 'riwayat'];

  return (
    <>
      <header className="top">
        <div className="top-in">
          <Link className="brand" to="/beranda"><Logo />Wakaloka</Link>
          <button className="menu-btn" ref={opener} aria-expanded={open} aria-controls="menu-panel" onClick={() => setOpen(true)}>Menu ☰</button>
        </div>
        <nav className="pub" aria-label="Menu utama">
          <Link to="/beranda" aria-current={cur('beranda')}>Beranda</Link><Link to="/galeri" aria-current={cur('galeri')}>Galeri</Link><Link to="/data" aria-current={cur('data')}>Data</Link>
        </nav>
      </header>
      <div className="sub"><nav className="sub-in" aria-label="Menu perjalanan">
        <Link to="/jelajah" aria-current={cur('jelajah')}>Jelajah</Link>
        <Link to={tiket[0]} aria-current={cur(tiket[2])}>{tiket[1]}</Link>
        <Link to="/akun" aria-current={cur('akun')}>{user ? 'Akun' : 'Masuk'}</Link>
      </nav></div>
      <div className="menu-panel" id="menu-panel" role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}
        onKeyDown={(e) => e.key === 'Escape' && tutup()} onClick={(e) => e.target.closest('a') && setOpen(false)}>
        <div className="menu-head"><Link className="brand" to="/beranda"><Logo />Wakaloka</Link><button className="menu-btn" ref={closer} onClick={tutup}>Tutup ✕</button></div>
        <nav className="menu-list" aria-label="Menu lengkap">
          <Link to="/beranda">Beranda</Link><Link to="/jelajah">Jelajah</Link><Link to="/galeri">Galeri</Link><Link to="/data">Data</Link>
          <Link to={tiket[0]}>{tiket[1]}</Link><Link to="/akun">Akun</Link>
          {!user && <><Link className="btn btn-p btn-b" to="/login">Masuk</Link><Link className="btn btn-p btn-b" to="/daftar">Daftar</Link></>}
        </nav>
      </div>
    </>
  );
}
