import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer><div className="foot">
      <div><b>Wakaloka</b><p>Jelajahi Wakatobi.<br />Dukung karya lokal.</p></div>
      <div><h3>Panduan website</h3><Link to="/beranda">Beranda</Link><Link to="/galeri">Galeri</Link><Link to="/data">Data</Link></div>
      <div><h3>Tentang proyek</h3><p>Kelompok 1 · Teknik Informatika<br />Universitas Pancasila</p></div>
    </div></footer>
  );
}
