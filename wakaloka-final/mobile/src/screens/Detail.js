import { Image, View } from 'react-native';
import { api } from '../api';
import { useAuth } from '../auth';
import { rp, bintang } from '../format';
import { foto, TENUN } from '../images';
import { useAsync } from '../hooks';
import { S, T, C } from '../theme';
import { Btn, Foto, Loaded, Note, Screen } from '../components/ui';

export default function Detail({ route, navigation }) {
  const { id } = route.params;
  const { user } = useAuth();
  const state = useAsync(() => api.get(`/destinations/${id}`), [id]);
  // Memesan butuh akun wisatawan: belum masuk -> ke Login, lalu otomatis kembali ke Checkout.
  const pesan = () => (user ? navigation.navigate('Checkout', { id }) : navigation.navigate('Login', { next: { name: 'Checkout', params: { id } } }));

  return <Loaded state={state}>{(w) => (
    <Screen>
      <T style={S.kicker}>{w.kategori} · Wakatobi</T>
      <T style={S.h1}>{w.nama_wisata}</T>
      <Foto source={foto(w.foto)} aspect={406 / 260} label={`Foto ${w.nama_wisata}`} />
      <T>{w.deskripsi}</T>
      <View style={[S.panel, S.cream]}>
        <T style={S.h2}>Rencanakan kunjungan</T>
        <View style={[S.between, { backgroundColor: C.yellow, padding: 8, borderRadius: 8 }]}><T style={S.bold}>{rp(w.harga_tiket)}</T><T style={S.bold}>{bintang(w.rating)}</T></View>
        <T style={S.muted}>Tarif per orang{w.produk_umkm.length ? ' · Produk UMKM dihitung terpisah' : ''}.</T>
        {user?.role === 'petugas'
          ? <Note>Akun petugas tidak dapat memesan tiket.</Note>
          : <Btn primary title="Atur pesanan →" onPress={pesan} />}
        <T style={S.muted}>Pembayaran bersifat simulasi tanpa pembebanan dana.</T>
      </View>
      <T style={S.h2}>Karya lokal di destinasi ini</T>
      {w.produk_umkm.length ? w.produk_umkm.map((p) => (
        <View key={p.id_produk} style={[S.panel, { flexDirection: 'row', gap: 12 }]}>
          <Image source={TENUN} accessibilityLabel={p.nama_produk} style={{ width: 88, height: 88, borderRadius: 4 }} resizeMode="cover" />
          <View style={{ flex: 1 }}><T style={S.bold}>{p.nama_produk}</T><T style={[S.bold, { color: C.biru }]}>{rp(p.harga)}</T>
            <T style={S.muted}>Tambahan opsional. Diambil di destinasi yang sama; tidak ada pengiriman.</T></View>
        </View>
      )) : <T>Produk UMKM belum tersedia untuk destinasi ini.</T>}
    </Screen>
  )}</Loaded>;
}
