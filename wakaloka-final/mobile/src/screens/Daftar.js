import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../api';
import { useForm } from '../hooks';
import { S, T } from '../theme';
import { AlertBox, Btn, Field, Screen } from '../components/ui';

export default function Daftar({ route, navigation }) {
  const { v, set, errors, setErrors, setServer } = useForm({ nama: '', email: '', no_telp: '', password: '', role: 'wisatawan', kode_petugas: '' });
  const [alert, setAlert] = useState(''), [busy, setBusy] = useState(false);

  async function submit() {
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
      navigation.replace('Login', { flash: 'Akun berhasil dibuat. Silakan masuk.', next: route.params?.next });
    } catch (e) {
      // Kode petugas salah = galat di kolom kode; email/telepon ganda memakai pesan server yang lebih jelas.
      const d = e.detail.length ? e.detail : e.kode === 'kode_petugas_salah' ? [{ field: 'kode_petugas', pesan: e.message }] : [];
      const d2 = e.kode === 'sudah_terdaftar' ? d.map((x) => ({ ...x, pesan: e.message })) : d;
      if (!setServer(d2)) setAlert(e.message);
      setBusy(false);
    }
  }

  return (
    <Screen>
      <T style={S.kicker}>Daftar akun</T>
      <T style={S.h1}>Buat akun Wakaloka.</T>
      <T>Isi data diri untuk memesan tiket dan melihat riwayat.</T>
      <AlertBox msg={alert} />
      <Field label="Nama lengkap" autoCapitalize="words" value={v.nama} onChangeText={set('nama')} error={errors.nama} />
      <Field label="Email" keyboardType="email-address" value={v.email} onChangeText={set('email')} error={errors.email} />
      <Field label="Nomor telepon" keyboardType="phone-pad" hint="Contoh: 08123456789" value={v.no_telp} onChangeText={set('no_telp')} error={errors.no_telp} />
      <Field label="Kata sandi" secure hint="Minimal 8 karakter." value={v.password} onChangeText={set('password')} error={errors.password} />
      <T style={S.bold}>Daftar sebagai</T>
      <View style={S.row}>
        {[['wisatawan', 'Wisatawan'], ['petugas', 'Petugas Loket']].map(([k, n]) => <Btn key={k} primary={v.role === k} title={n} style={{ flex: 1 }} onPress={() => set('role')(k)} />)}
      </View>
      {v.role === 'petugas' && <Field label="Kode petugas · khusus Petugas Loket" hint="Kode diberikan pengelola loket." value={v.kode_petugas} onChangeText={set('kode_petugas')} error={errors.kode_petugas} />}
      <Btn primary title={busy ? 'Memproses…' : 'Daftar'} disabled={busy} onPress={submit} />
      <Btn title="Sudah punya akun? Masuk" onPress={() => navigation.replace('Login', { next: route.params?.next })} />
    </Screen>
  );
}
