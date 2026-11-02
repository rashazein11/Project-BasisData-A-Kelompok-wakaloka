import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { rp, tgl, STATUS } from '../format.js';
import { useAsync, usePageTitle } from '../hooks.js';
import { Loaded } from '../components/ui.jsx';

export default function Etiket() {
  usePageTitle('E-tiket');
  const { id } = useParams();
  const baru = useSearchParams()[0].has('baru');
  const state = useAsync(() => api.get(`/me/tickets/${id}`), [id]);
  return <Loaded state={state}>{(t) => (
    <div className="wrap">
      <p className="kicker">Tiket saya / E-tiket</p><h1>Satu ID untuk ditunjukkan.</h1>
      {baru && <p className="note" role="status" style={{ marginTop: 12 }}>✓ PESANAN BERHASIL · SIMULASI. Tidak ada dana yang dibebankan.</p>}
      <div className="row2 row-form top-align" style={{ marginTop: 20 }}>
        <article className="panel stack" aria-label="E-tiket">
          <img src={t.foto} alt={`Foto ${t.nama_wisata}`} width="406" height="260" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 'var(--r-media)' }} />
          <h2>{t.nama_wisata}</h2>
          <p><span className={`badge ${t.status}`}>{STATUS[t.status]}</span></p>
          <p style={{ margin: 0 }}>Pemilik: {t.pemilik}<br />Kunjungan: {tgl(t.tgl_kunjungan)}<br />Jumlah: {t.jumlah_orang} orang<br />Berlaku sampai: {tgl(t.tgl_berlaku)} inklusif</p>
          <p style={{ margin: 0 }}>{t.rincian.length ? t.rincian.map((r) => `${r.nama_produk} × ${r.jumlah} · Ambil di destinasi`).join(', ') : 'Tanpa produk UMKM'}<br /><b>Total simulasi: {rp(t.total)}</b></p>
          <div><div className="lbl">ID tiket</div><div className="mono" id="idt">{t.id_tiket}</div><p className="hint">Tunjukkan ID ini kepada petugas loket. Tidak menggunakan QR.</p></div>
        </article>
        <div className="stack">
          <h2 style={{ fontSize: 20 }}>Saat tiba di destinasi</h2>
          <ol className="steps"><li>Buka tiket ini dari Tiket saya.</li><li>Tunjukkan ID tiket kepada petugas.</li><li>Petugas mencari ID, lalu memvalidasi kunjungan secara terpisah.</li></ol>
          <p className="note">Tiket yang sudah digunakan, kedaluwarsa, atau tidak ditemukan tidak dapat divalidasi.</p>
          <Link className="btn btn-b" to="/riwayat">Lihat riwayat saya</Link>
          <Link className="btn btn-p btn-b" to={`/terima-kasih/${t.id_tiket}`}>Selesai</Link>
        </div>
      </div>
    </div>
  )}</Loaded>;
}
