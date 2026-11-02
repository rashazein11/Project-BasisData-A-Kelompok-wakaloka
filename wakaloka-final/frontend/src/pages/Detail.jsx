import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { rp, bintang } from '../format.js';
import { useAsync, usePageTitle } from '../hooks.js';
import { Loaded } from '../components/ui.jsx';

export default function Detail() {
  usePageTitle('Detail destinasi');
  const { id } = useParams();
  const state = useAsync(() => api.get(`/destinations/${id}`), [id]);
  return <Loaded state={state}>{(w) => (
    <div className="wrap">
      <p className="crumb"><Link to="/jelajah">Jelajah</Link> / {w.nama_wisata}</p>
      <p className="kicker">{w.kategori.toUpperCase()} · Wakatobi</p><h1>{w.nama_wisata}</h1>
      <p className="lead" style={{ margin: '8px 0 20px' }}>{w.kategori} di Kepulauan Wakatobi.</p>
      <img src={w.foto} alt={`Foto ${w.nama_wisata}`} width="1280" height="480" fetchpriority="high"
        style={{ width: '100%', aspectRatio: '8/3', objectFit: 'cover', borderRadius: 'var(--r-media)', marginBottom: 24 }} />
      <div className="row2 top-align">
        <div>
          <h2>Kenali {w.nama_wisata}.</h2>
          <p style={{ marginTop: 12 }}>{w.deskripsi}</p>
          <p className="muted">Pilih tanggal kunjungan sebelum memesan. Tarif dan rating mengikuti data Wakaloka.</p>
          <hr />
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Karya lokal di destinasi ini</h2>
          {w.produk_umkm.length ? w.produk_umkm.map((p) => (
            <div key={p.id_produk} className="panel row2" style={{ gridTemplateColumns: '96px 1fr', gap: 16, marginBottom: 12 }}>
              <div className="tenun" role="img" aria-label={p.nama_produk} style={{ aspectRatio: '1' }}></div>
              <div><h3>{p.nama_produk}</h3><p className="total" style={{ color: '#2c5b78', fontSize: 20 }}>{rp(p.harga)}</p>
                <p className="muted">Tambahan opsional untuk pesananmu. Diambil di destinasi yang sama; tidak ada pengiriman.</p></div>
            </div>
          )) : <p>Produk UMKM belum tersedia untuk destinasi ini.</p>}
        </div>
        <aside className="panel cream stack" aria-label="Rencanakan kunjungan">
          <h2 style={{ fontSize: 20 }}>Rencanakan kunjungan</h2>
          <div className="price" style={{ borderRadius: 'var(--r-ctl)' }}><span>{rp(w.harga_tiket)}</span><span>{bintang(w.rating)}</span></div>
          <p className="muted" style={{ margin: 0 }}>Tarif per orang{w.produk_umkm.length ? ' · Produk UMKM dihitung terpisah' : ''}.</p>
          <Link className="btn btn-p btn-b" to={`/checkout/${w.id_wisata}`}>Atur pesanan →</Link>
          <p className="note" style={{ margin: 0 }}>Pilih tanggal dan jumlah orang{w.produk_umkm.length ? ' (serta produk UMKM)' : ''} di halaman berikutnya. Produk tidak wajib dibeli.</p>
          <p className="muted" style={{ margin: 0 }}>Pembayaran bersifat simulasi tanpa pembebanan dana.</p>
        </aside>
      </div>
    </div>
  )}</Loaded>;
}
