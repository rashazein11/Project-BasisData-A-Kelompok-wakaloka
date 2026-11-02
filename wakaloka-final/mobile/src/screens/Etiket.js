import { View } from 'react-native';
import { api } from '../api';
import { rp, tgl, STATUS } from '../format';
import { foto } from '../images';
import { useAsync } from '../hooks';
import { C, S, T } from '../theme';
import { Badge, Btn, Foto, Loaded, Note, Screen } from '../components/ui';

export default function Etiket({ route, navigation }) {
  const { id, baru } = route.params;
  const state = useAsync(() => api.get(`/me/tickets/${id}`), [id]);
  return <Loaded state={state}>{(t) => (
    <Screen>
      <T style={S.kicker}>Tiket saya / E-tiket</T>
      <T style={S.h1}>Satu ID untuk ditunjukkan.</T>
      {baru && <Note>✓ PESANAN BERHASIL · SIMULASI. Tidak ada dana yang dibebankan.</Note>}
      <View style={S.panel}>
        <Foto source={foto(t.foto)} aspect={406 / 260} label={`Foto ${t.nama_wisata}`} />
        <T style={S.h2}>{t.nama_wisata}</T>
        <Badge status={t.status}>{STATUS[t.status]}</Badge>
        <T>Pemilik: {t.pemilik}{'\n'}Kunjungan: {tgl(t.tgl_kunjungan)}{'\n'}Jumlah: {t.jumlah_orang} orang{'\n'}Berlaku sampai: {tgl(t.tgl_berlaku)} inklusif</T>
        <T>{t.rincian.length ? t.rincian.map((r) => `${r.nama_produk} × ${r.jumlah} · Ambil di destinasi`).join(', ') : 'Tanpa produk UMKM'}{'\n'}<T style={S.bold}>Total simulasi: {rp(t.total)}</T></T>
        <T style={S.kicker}>ID tiket</T>
        <View style={{ backgroundColor: C.cream, padding: 12, borderRadius: 4 }}><T selectable style={{ fontFamily: 'monospace', fontWeight: '600' }}>{t.id_tiket}</T></View>
        <T style={S.muted}>Tunjukkan ID ini kepada petugas loket. Tidak menggunakan QR.</T>
      </View>
      <T style={S.h2}>Saat tiba di destinasi</T>
      <T>1. Buka tiket ini dari tab Tiket.{'\n'}2. Tunjukkan ID tiket kepada petugas.{'\n'}3. Petugas mencari ID, lalu memvalidasi kunjungan secara terpisah.</T>
      <Note>Tiket yang sudah digunakan, kedaluwarsa, atau tidak ditemukan tidak dapat divalidasi.</Note>
      <Btn primary title="Selesai" onPress={() => navigation.popTo('Tabs', { screen: 'Beranda' })} />
    </Screen>
  )}</Loaded>;
}
