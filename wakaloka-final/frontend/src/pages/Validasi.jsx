import { useState } from 'react';
import { api } from '../api.js';
import { rp, tgl, STATUS } from '../format.js';
import { useFormErrors, usePageTitle } from '../hooks.js';
import { Alert, Field } from '../components/ui.jsx';

const HINT = 'Pencarian hanya membaca data. Tiket belum berubah menjadi digunakan sampai Anda memilih Validasi tiket.';

export default function Validasi() {
  usePageTitle('Validasi tiket');
  const [idt, setIdt] = useState(''), [t, setT] = useState(null), [pesan, setPesan] = useState(''), [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(''); // '' | 'cari' | 'val'
  const { errors, setErrors, ref, clear } = useFormErrors();

  async function cari(e) {
    e.preventDefault();
    setT(null); setAlert(''); setPesan('');
    const id = idt.trim();
    if (!id) return setErrors({ idt: 'ID tiket wajib diisi.' });
    setBusy('cari');
    try { setT(await api.get(`/staff/tickets/${encodeURIComponent(id)}`)); }
    catch (err) { setAlert(err.status === 404 ? 'ID tiket tidak ditemukan. Periksa kembali ID yang ditunjukkan pengunjung.' : err.message); }
    setBusy('');
  }
  async function validasi() {
    setBusy('val'); setAlert('');
    try { await api.post(`/staff/tickets/${t.id_tiket}/validate`, {}); setT({ ...t, status: 'terpakai' }); setPesan('Tiket berhasil divalidasi dan sekarang ditandai digunakan.'); }
    catch (err) { setAlert(err.message); }
    setBusy('');
  }
  const batal = () => { setT(null); setAlert(''); setPesan(''); setIdt(''); document.getElementById('idt').focus(); };
  const aktif = t?.status === 'aktif';

  return (
    <div className="wrap"><p className="kicker">Ruang petugas · Akses terbatas</p><h1>Periksa dahulu. Validasi setelah pasti.</h1>
      <div className="row2 row-form top-align" style={{ marginTop: 20 }}>
        <div>
          <form noValidate className="panel" ref={ref} onSubmit={cari} onInput={clear}>
            <Field id="idt" label="ID tiket pengunjung" spellCheck="false" hint={HINT} value={idt} onChange={(e) => setIdt(e.target.value)} error={errors.idt} />
            <button className="btn btn-p btn-b" type="submit" disabled={busy === 'cari'}>{busy === 'cari' ? 'Memproses…' : 'Cari tiket'}</button>
          </form>
          <div aria-live="polite" style={{ marginTop: 16 }}>
            <Alert msg={alert} />
            {t && (
              <article className="panel stack"><p className="kicker">Hasil pencarian</p>
                <p><span className={`badge ${t.status}`}>{aktif ? 'Valid · ' : ''}{STATUS[t.status]}</span></p>
                <h2 style={{ fontSize: 20 }}>{t.nama_wisata}</h2>
                <p style={{ margin: 0 }}>ID tiket: {t.id_tiket}<br />Pemilik: {t.pemilik}<br />Kunjungan: {tgl(t.tgl_kunjungan)}<br />Jumlah: {t.jumlah_orang} orang<br />Berlaku sampai: {tgl(t.tgl_berlaku)} inklusif<br />{t.rincian.length ? t.rincian.map((r) => `${r.nama_produk} × ${r.jumlah}`).join(', ') : 'Tanpa produk UMKM'} · {rp(t.total)}</p>
                {pesan && <p className="note" role="status">{pesan}</p>}
                {aktif ? <><h3>Konfirmasi pemakaian tiket</h3><p className="muted" style={{ margin: 0 }}>Setelah divalidasi, tiket ditandai digunakan dan tidak dapat digunakan kembali.</p>
                  <button className="btn btn-p btn-b" onClick={validasi} disabled={busy === 'val'}>{busy === 'val' ? 'Memproses…' : 'Validasi tiket'}</button></>
                  : <p className="alert">Tiket ini tidak dapat divalidasi ({STATUS[t.status].toLowerCase()}).</p>}
                <button className="btn btn-b" onClick={batal}>Batal / cari ID lain</button></article>
            )}
          </div>
        </div>
        <aside className="panel cream stack"><h2 style={{ fontSize: 20 }}>Sebelum memvalidasi</h2>
          <p>Cocokkan destinasi, tanggal berlaku, dan jumlah pengunjung. Tolak ID tidak ditemukan, tiket kedaluwarsa, atau tiket yang sudah digunakan.</p>
          <p className="muted" style={{ margin: 0 }}>Tidak perlu pemindaian QR. Gunakan ID yang ditunjukkan pengunjung.</p></aside>
      </div>
    </div>
  );
}
