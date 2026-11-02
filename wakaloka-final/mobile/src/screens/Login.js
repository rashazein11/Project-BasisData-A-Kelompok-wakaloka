import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';
import { useForm } from '../hooks';
import { S, T } from '../theme';
import { AlertBox, Btn, Field, Note, Screen } from '../components/ui';

export default function Login({ route, navigation }) {
  const { login } = useAuth();
  const { flash, next } = route.params || {};
  const { v, set, errors, setErrors } = useForm({ identitas: '', password: '' });
  const [alert, setAlert] = useState(''), [busy, setBusy] = useState(false);

  async function submit() {
    setAlert('');
    const err = {};
    if (!v.identitas.trim()) err.identitas = 'Email atau nomor telepon wajib diisi.';
    if (!v.password) err.password = 'Kata sandi wajib diisi.';
    if (Object.keys(err).length) return setErrors(err);
    setBusy(true);
    try {
      const r = await api.post('/auth/login', { identitas: v.identitas.trim(), password: v.password });
      await login(r.token, r.pengguna);
      // Dari tombol "Atur pesanan": lanjut ke Checkout. Petugas tidak memesan, jadi cukup kembali.
      if (next && r.pengguna.role === 'wisatawan') navigation.replace(next.name, next.params); else navigation.goBack();
    } catch (e) { setAlert(e.message); setBusy(false); }
  }

  return (
    <Screen>
      <T style={S.kicker}>Akun wisatawan dan petugas</T>
      <T style={S.h1}>Selamat datang kembali.</T>
      <T>Masuk untuk membuat pesanan dan melihat tiket milikmu.</T>
      {flash && <Note>{flash}</Note>}
      <AlertBox msg={alert} />
      <Field label="Email atau nomor telepon" keyboardType="email-address" textContentType="username" value={v.identitas} onChangeText={set('identitas')} error={errors.identitas} />
      <Field label="Kata sandi" secure textContentType="password" value={v.password} onChangeText={set('password')} error={errors.password} />
      <Btn primary title={busy ? 'Memproses…' : 'Masuk'} disabled={busy} onPress={submit} />
      <Btn title="Belum punya akun? Daftar" onPress={() => navigation.replace('Daftar', { next })} />
    </Screen>
  );
}
