import { View } from 'react-native';
import { api } from '../api';
import { useAuth } from '../auth';
import { rp, tgl, STATUS } from '../format';
import { foto } from '../images';
import { useFocusAsync } from '../hooks';
import { C, S, T } from '../theme';
import { Badge, Btn, Foto, Loaded, Screen } from '../components/ui';

export default function Riwayat({ navigation }) {
  const { user } = useAuth();
  const state = useFocusAsync(() => api.get('/me/orders'));
  return <Loaded state={state}>{(daftar) => (
    <Screen>
      <T style={S.kicker}>Tiket saya / Riwayat</T>
      <T style={S.h1}>Catatan perjalananmu.</T>
      <T>Pesanan milik {user.nama} · {user.email}</T>
      <T style={S.bold}>Semua pesanan · {daftar.length}</T>
      {daftar.length ? daftar.map((t) => (
        <View key={t.id_tiket} style={S.panel}>
          <Foto source={foto(t.foto)} aspect={406 / 260} label={`Foto ${t.nama_wisata}`} />
          <T style={S.h2}>{t.nama_wisata}</T>
          <T>ID tiket: {t.id_tiket}{'\n'}Kunjungan: {tgl(t.tgl_kunjungan)} · {t.jumlah_orang} orang{'\n'}{t.rincian.length ? t.rincian.map((r) => `${r.nama_produk} × ${r.jumlah}`).join(', ') : 'Tanpa produk UMKM'}</T>
          <T style={[S.bold, { color: C.biru }]}>{rp(t.total)}</T>
          <Badge status={t.status}>{STATUS[t.status]}</Badge>
          <T style={S.muted}>Berlaku sampai {tgl(t.tgl_berlaku)}</T>
          <Btn title="Buka e-tiket →" onPress={() => navigation.navigate('Etiket', { id: t.id_tiket })} />
        </View>
      )) : <View style={S.panel}><T>Belum ada pesanan.</T><Btn primary title="Jelajahi destinasi →" onPress={() => navigation.navigate('Jelajah')} /></View>}
      <T style={S.muted}>Riwayat hanya menampilkan pesanan milik akun ini.</T>
    </Screen>
  )}</Loaded>;
}
