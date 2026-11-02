import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useFormErrors, usePageTitle } from '../hooks.js';
import { Alert, Field, PasswordField } from '../components/ui.jsx';

export default function Login() {
  usePageTitle('Masuk');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation(); // { from } dari layar tertutup, { flash } dari Daftar
  const [identitas, setIdentitas] = useState(''), [password, setPassword] = useState('');
  const [alert, setAlert] = useState(''), [busy, setBusy] = useState(false);
  const { errors, setErrors, ref, clear } = useFormErrors();

  async function submit(e) {
    e.preventDefault();
    setAlert('');
    const err = {};
    if (!identitas.trim()) err.identitas = 'Email atau nomor telepon wajib diisi.';
    if (!password) err.password = 'Kata sandi wajib diisi.';
    if (Object.keys(err).length) return setErrors(err);
    setBusy(true);
    try {
      const r = await api.post('/auth/login', { identitas: identitas.trim(), password });
      login(r.token, r.pengguna);
      navigate(state?.from || (r.pengguna.role === 'petugas' ? '/validasi' : '/beranda'), { replace: true });
    } catch (e2) { setAlert(e2.message); setBusy(false); }
  }

  return (
    <div className="wrap"><div className="row2 row-form top-align">
      <figure style={{ margin: 0 }}><img src="assets/img/hoga.jpg" alt="Penyelam di antara terumbu karang berwarna-warni" width="600" height="480" />
        <figcaption><b>Perjalananmu berawal di sini.</b><br /><span className="muted">Laut yang jernih. Karya yang dekat dengan warga.</span></figcaption></figure>
      <form noValidate ref={ref} onSubmit={submit} onInput={clear}>
        <p className="kicker">Akun wisatawan dan petugas</p><h1>Selamat datang kembali.</h1>
        <p className="lead" style={{ margin: '8px 0 16px' }}>Masuk untuk membuat pesanan dan melihat tiket milikmu.</p>
        {state?.flash && <div className="note" role="status" style={{ marginBottom: 12 }}>{state.flash}</div>}
        <Alert msg={alert} />
        <Field id="identitas" label="Email atau nomor telepon" autoComplete="username" inputMode="email" required value={identitas} onChange={(e) => setIdentitas(e.target.value)} error={errors.identitas} />
        <PasswordField id="password" label="Kata sandi" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <button className="btn btn-p btn-b" type="submit" disabled={busy}>{busy ? 'Memproses…' : 'Masuk'}</button>
        <p className="hint">Gunakan email atau nomor telepon yang terhubung ke akun, lalu masukkan kata sandi.</p>
        <div className="stack" style={{ marginTop: 12 }}><Link className="btn btn-b" to="/jelajah">Kembali menjelajah</Link><Link className="btn btn-b" to="/daftar">Belum punya akun? Daftar</Link></div>
      </form>
    </div></div>
  );
}
