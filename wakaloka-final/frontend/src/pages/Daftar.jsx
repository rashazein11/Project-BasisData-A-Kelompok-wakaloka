import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useFormErrors, usePageTitle } from '../hooks.js';
import { Alert, Field, PasswordField } from '../components/ui.jsx';

export default function Daftar() {
  usePageTitle('Daftar');
  const navigate = useNavigate();
  const [v, setV] = useState({ nama: '', email: '', no_telp: '', password: '', role: 'wisatawan', kode_petugas: '' });
  const [alert, setAlert] = useState(''), [busy, setBusy] = useState(false);
  const { errors, setErrors, ref, clear, setServer } = useFormErrors();
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setAlert('');
    const b = { nama: v.nama.trim(), email: v.email.trim(), no_telp: v.no_telp.trim(), password: v.password, role: v.role, kode_petugas: v.kode_petugas.trim() || undefined };
    const err = {};
    if (!b.nama) err.nama = 'Nama wajib diisi.';
    if (!/^\S+@\S+\.\S+$/.test(b.email)) err.email = 'Format email tidak valid.';
    if (!b.no_telp) err.no_telp = 'Nomor telepon wajib diisi.';
    if (b.password.length < 8) err.password = 'Kata sandi minimal 8 karakter.';
    if (b.role === 'petugas' && !b.kode_petugas) err.kode_petugas = 'Kode petugas wajib diisi untuk Petugas Loket.';
    if (Object.keys(err).length) return setErrors(err);
    setBusy(true);
    try {
      await api.post('/auth/register', b);
      navigate('/login', { state: { flash: 'Akun berhasil dibuat. Silakan masuk.' } });
    } catch (e2) {
      // Kode petugas salah = galat di kolom kode; email/telepon ganda memakai pesan server yang lebih jelas.
      const d = e2.detail.length ? e2.detail : e2.kode === 'kode_petugas_salah' ? [{ field: 'kode_petugas', pesan: e2.message }] : [];
      const d2 = e2.kode === 'sudah_terdaftar' ? d.map((x) => ({ ...x, pesan: e2.message })) : d;
      if (!setServer(d2)) setAlert(e2.message);
      setBusy(false);
    }
  }

  return (
    <div className="wrap"><div className="row2 row-form top-align">
      <figure style={{ margin: 0 }}><img src="assets/img/hoga.jpg" alt="Penyelam di antara terumbu karang berwarna-warni" width="600" height="480" />
        <figcaption><b>Perjalananmu berawal di sini.</b><br /><span className="muted">Laut yang jernih. Karya yang dekat dengan warga.</span></figcaption></figure>
      <form noValidate ref={ref} onSubmit={submit} onInput={clear}>
        <p className="kicker">Daftar akun</p><h1>Buat akun Wakaloka.</h1>
        <p className="lead" style={{ margin: '8px 0 16px' }}>Isi data diri untuk memesan tiket dan melihat riwayat.</p>
        <Alert msg={alert} />
        <Field id="nama" label="Nama lengkap" autoComplete="name" value={v.nama} onChange={set('nama')} error={errors.nama} />
        <Field id="email" label="Email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
        <Field id="no_telp" label="Nomor telepon" type="tel" autoComplete="tel" inputMode="tel" hint="Contoh: 08123456789" value={v.no_telp} onChange={set('no_telp')} error={errors.no_telp} />
        <PasswordField id="password" label="Kata sandi" autoComplete="new-password" hint="Minimal 8 karakter." value={v.password} onChange={set('password')} error={errors.password} />
        <div className="field"><label htmlFor="role">Daftar sebagai</label>
          <select id="role" name="role" value={v.role} onChange={set('role')}><option value="wisatawan">Wisatawan</option><option value="petugas">Petugas Loket</option></select></div>
        <Field id="kode_petugas" label="Kode petugas · khusus Petugas Loket" hint="Kosongkan jika Wisatawan. Kode diberikan pengelola loket." placeholder="Kosongkan jika Wisatawan" value={v.kode_petugas} onChange={set('kode_petugas')} error={errors.kode_petugas} />
        <button className="btn btn-p btn-b" type="submit" disabled={busy}>{busy ? 'Memproses…' : 'Daftar'}</button>
        <Link className="btn btn-b" style={{ marginTop: 12 }} to="/login">Sudah punya akun? Masuk</Link>
      </form>
    </div></div>
  );
}
