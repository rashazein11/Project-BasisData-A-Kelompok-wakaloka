import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { rp, tgl, hariIni, tambahHari } from '../format.js';
import { useAsync, useFormErrors, usePageTitle } from '../hooks.js';
import { Alert, Field, Loaded, Stepper } from '../components/ui.jsx';

export default function Checkout() {
  usePageTitle('Periksa pesanan');
  const { id } = useParams();
  const state = useAsync(() => api.get(`/destinations/${id}`), [id]);
  return <Loaded state={state}>{(w) => <Form w={w} />}</Loaded>;
}

function Form({ w }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = hariIni();
  const [kunjungan, setKunjungan] = useState(''), [orangStr, setOrang] = useState('1'), [jml, setJml] = useState({});
  const [alert, setAlert] = useState(''), [busy, setBusy] = useState(false);
  const { errors, setErrors, ref, clear, setServer } = useFormErrors();

  // Hanya untuk tampilan; total resmi dihitung ulang oleh server (BR-03).
  const orang = Math.max(1, parseInt(orangStr, 10) || 0);
  const items = w.produk_umkm.map((p) => ({ p, n: Math.max(0, parseInt(jml[p.id_produk], 10) || 0) })).filter((i) => i.n > 0);
  const total = w.harga_tiket * orang + items.reduce((s, i) => s + i.p.harga * i.n, 0);

  async function submit(e) {
    e.preventDefault();
    setAlert('');
    if (!kunjungan) return setErrors({ tgl_kunjungan: 'Tanggal kunjungan wajib diisi.' });
    if (kunjungan < today) return setErrors({ tgl_kunjungan: 'Tanggal tidak boleh sebelum hari ini.' });
    setBusy(true);
    try {
      const r = await api.post('/orders', { id_wisata: w.id_wisata, tgl_kunjungan: kunjungan, jumlah_orang: orang, produk: items.map((i) => ({ id_produk: i.p.id_produk, jumlah: i.n })) });
      navigate(`/tiket/${r.tiket.id_tiket}?baru=1`);
    } catch (err) { if (!setServer(err.detail)) setAlert(err.message); setBusy(false); }
  }

  return (
    <div className="wrap">
      <p className="crumb"><Link to="/jelajah">Jelajah</Link> / <Link to={`/destinasi/${w.id_wisata}`}>{w.nama_wisata}</Link> / Checkout</p>
      <h1>Periksa rencana perjalananmu.</h1>
      <p className="lead" style={{ margin: '8px 0 20px' }}>Pesananmu tersimpan setelah menekan Buat pesanan. Pembayaran bersifat simulasi.</p>
      <form noValidate ref={ref} onSubmit={submit} onInput={clear} className="row2 row-form top-align">
        <div>
          <img src={w.foto} alt={`Foto ${w.nama_wisata}`} width="406" height="260" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 'var(--r-media)' }} />
          <h2 style={{ fontSize: 22, margin: '12px 0 4px' }}>{w.nama_wisata}</h2>
          <p className="muted">Pemesan: {user.nama} · {user.email}</p>
          <Alert msg={alert} />
          <Field id="tgl_kunjungan" label="Tanggal kunjungan · wajib" type="date" min={today} value={kunjungan} onChange={(e) => setKunjungan(e.target.value)} error={errors.tgl_kunjungan} />
          <Stepper id="jumlah_orang" label="Jumlah pengunjung" value={orangStr} min={1} max={50} onChange={setOrang} />
          {w.produk_umkm.length ? (
            <><hr /><h3>Produk UMKM · Opsional</h3><p className="muted">Diambil di destinasi, tidak dikirim. Atur ke 0 untuk tanpa UMKM.</p>
              {w.produk_umkm.map((p) => (
                <div key={p.id_produk}><p><b>{p.nama_produk}</b> · {rp(p.harga)}</p>
                  <Stepper id={`produk_${p.id_produk}`} label={`Jumlah ${p.nama_produk}`} value={jml[p.id_produk] ?? '0'} min={0} max={20} onChange={(x) => setJml({ ...jml, [p.id_produk]: x })} /></div>
              ))}</>
          ) : <p className="muted">Produk UMKM belum tersedia untuk destinasi ini.</p>}
          <p className="note">{kunjungan ? `Berlaku sampai ${tgl(tambahHari(kunjungan, 7))} inklusif. Setelah tanggal tersebut tiket ditolak.` : 'Tiket berlaku tujuh hari sejak tanggal kunjungan (inklusif).'}</p>
        </div>
        <aside className="panel orange stack" aria-label="Ringkasan pesanan">
          <h2 style={{ fontSize: 20 }}>Ringkasan pesanan</h2>
          <div>
            <div className="line"><span>{w.nama_wisata}<br /><small>{orang} orang × {rp(w.harga_tiket)}</small></span></div>
            {items.map((i) => <div className="line" key={i.p.id_produk}><span>{i.p.nama_produk}<br /><small>{i.n} produk × {rp(i.p.harga)}</small></span></div>)}
            <hr /><div className="line"><span>Total simulasi</span></div><div className="total" aria-live="polite">{rp(total)}</div>
          </div>
          <button className="btn btn-p btn-b" type="submit" disabled={busy}>{busy ? 'Memproses…' : 'Buat pesanan'}</button>
          <Link className="btn btn-b" to={`/destinasi/${w.id_wisata}`}>Kembali ke detail</Link>
          <p className="muted" style={{ margin: 0, color: 'var(--ink)' }}>Simulasi tanpa pembayaran. Menekan Buat pesanan tidak membebankan dana.</p>
        </aside>
      </form>
    </div>
  );
}
