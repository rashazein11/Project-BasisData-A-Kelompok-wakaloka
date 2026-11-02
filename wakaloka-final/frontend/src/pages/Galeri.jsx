import { Link } from 'react-router-dom';
import { rp } from '../format.js';
import { useAsync, usePageTitle } from '../hooks.js';
import { DestCard, Loaded } from '../components/ui.jsx';
import { muatDenganUmkm } from './Beranda.jsx';

export default function Galeri() {
  usePageTitle('Galeri');
  const state = useAsync(muatDenganUmkm, []);
  return <Loaded state={state}>{({ semua, tomia, produk }) => {
    const kota = tomia?.nama_wisata.split(' ')[0];
    return (
      <div className="wrap">
        <p className="kicker">Album Wakatobi</p><h1>Enam tempat. Banyak sudut pandang.</h1>
        <p className="lead" style={{ margin: '8px 0 20px' }}>Potret sabana, hutan mangrove, pesisir, dan dunia bawah laut dari koleksi destinasi Wakaloka.</p>
        <div className="grid">{semua.map((w) => <DestCard key={w.id_wisata} w={w} aksi="Kenali destinasi" />)}</div>
        {produk && (
          <section className="band"><div>
            <p className="kicker">Produk UMKM · {kota}</p><h2>Warna yang ikut pulang.</h2>
            <p>{produk.nama_produk}, kain tenun warna-warni yang dapat ditambahkan ke tiket {tomia.nama_wisata}.</p>
            <p className="total" style={{ color: '#2c5b78' }}>{rp(produk.harga)}</p><p className="muted">Opsional · Pengambilan di destinasi yang sama.</p>
            <Link className="btn btn-p" to={`/destinasi/${tomia.id_wisata}`}>Lihat detail {kota} →</Link></div>
            <div className="tenun" role="img" aria-label="Kain Tenun Gelo berwarna-warni"></div></section>
        )}
      </div>
    );
  }}</Loaded>;
}
