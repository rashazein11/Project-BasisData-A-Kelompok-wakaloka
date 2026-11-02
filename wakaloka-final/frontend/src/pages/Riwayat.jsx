import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { rp, tgl, STATUS } from '../format.js';
import { useAsync, usePageTitle } from '../hooks.js';
import { Loaded } from '../components/ui.jsx';

export default function Riwayat() {
  usePageTitle('Riwayat');
  const { user } = useAuth();
  const state = useAsync(() => api.get('/me/orders'), []);
  return <Loaded state={state}>{(daftar) => (
    <div className="wrap"><p className="kicker">Tiket saya / Riwayat</p><h1>Catatan perjalananmu.</h1>
      <p className="lead" style={{ margin: '8px 0 16px' }}>Pesanan milik {user.nama} · {user.email}</p>
      <p><b>Semua pesanan · {daftar.length}</b></p>
      <div className="stack" style={{ marginTop: 12 }}>{daftar.length ? daftar.map((t) => (
        <article key={t.id_tiket} className="panel row2" style={{ gridTemplateColumns: 'minmax(0,200px) 1fr', gap: 16, alignItems: 'start' }}>
          <img src={t.foto} alt={`Foto ${t.nama_wisata}`} width="406" height="260" style={{ borderRadius: 'var(--r-media)', aspectRatio: '4/3', objectFit: 'cover' }} />
          <div className="stack"><h2 style={{ fontSize: 20 }}>{t.nama_wisata}</h2>
            <p style={{ margin: 0 }}>ID tiket <span className="mono" style={{ fontSize: 12, padding: '2px 6px' }}>{t.id_tiket}</span><br />Kunjungan: {tgl(t.tgl_kunjungan)} · {t.jumlah_orang} orang<br />{t.rincian.length ? t.rincian.map((r) => `${r.nama_produk} × ${r.jumlah}`).join(', ') : 'Tanpa produk UMKM'}</p>
            <p className="total" style={{ color: '#2c5b78', margin: 0, fontSize: 18 }}>{rp(t.total)}</p>
            <p style={{ margin: 0 }}><span className={`badge ${t.status}`}>{STATUS[t.status]}</span> · berlaku sampai {tgl(t.tgl_berlaku)}</p>
            <Link className="btn" to={`/tiket/${t.id_tiket}`}>Buka e-tiket →</Link></div>
        </article>
      )) : <div className="panel"><p>Belum ada pesanan.</p><Link className="btn btn-p" to="/jelajah">Jelajahi destinasi →</Link></div>}</div>
      <p className="muted" style={{ marginTop: 16 }}>Riwayat hanya menampilkan pesanan milik akun ini.</p></div>
  )}</Loaded>;
}
