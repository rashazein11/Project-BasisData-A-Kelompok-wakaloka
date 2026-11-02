import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import TabBawah, { LAYAR_TAB } from './TabBawah.jsx';

export default function Layout() {
  const main = useRef(null);
  const { pathname } = useLocation();
  const seg = pathname.split('/')[1];
  const tab = LAYAR_TAB.includes(seg);
  // Pindah layar: kembali ke atas dan fokus ke konten agar pembaca layar tahu halaman berganti.
  useEffect(() => { window.scrollTo(0, 0); main.current.focus({ preventScroll: true }); }, [pathname]);
  return (
    <div className={tab ? 'has-tabs' : undefined}>
      <a className="skip" href="#app" onClick={(e) => { e.preventDefault(); main.current.focus(); }}>Lewati ke konten</a>
      <Header />
      <main id="app" tabIndex={-1} ref={main}><Outlet /></main>
      <Footer />
      {tab && <TabBawah seg={seg} />}
    </div>
  );
}
