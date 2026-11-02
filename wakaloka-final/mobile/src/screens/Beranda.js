import { View } from 'react-native';
import { api } from '../api';
import { rp } from '../format';
import { HERO, TENUN_LEBAR } from '../images';
import { useAsync } from '../hooks';
import { S, T, C } from '../theme';
import { Btn, DestCard, Foto, Loaded, Note, Screen } from '../components/ui';

const PILIHAN = ['Goa Kontamale', 'Pulau Hoga', 'Tomia Puncak Khayangan'];

export default function Beranda({ navigation }) {
  const state = useAsync(async () => {
    const semua = await api.get('/destinations');
    const tomia = semua.find((w) => w.umkm.length);
    const produk = tomia && (await api.get(`/destinations/${tomia.id_wisata}`)).produk_umkm[0];
    return { semua, tomia, produk };
  }, []);
  const buka = (id) => navigation.navigate('Detail', { id });

  return <Loaded state={state}>{({ semua, tomia, produk }) => (
    <Screen>
      <T style={S.kicker}>Catatan perjalanan dari Wakatobi</T>
      <T style={S.h1}>Jelajahi pulau. Bawa pulang cerita lokal.</T>
      <T>Dari sabana Tomia hingga biru Pulau Hoga. Temukan destinasi, pesan tiket, dan kenali karya warga di sepanjang perjalanan.</T>
      <Foto source={HERO} aspect={620 / 580} label="Foto udara pulau berhutan dikelilingi laut biru" />
      <Btn primary title="Jelajahi destinasi →" onPress={() => navigation.navigate('Jelajah')} />
      <T style={[S.kicker, { marginTop: 12 }]}>Pilihan perjalanan</T>
      <T style={S.h2}>Tiga cara mengenal Wakatobi.</T>
      {PILIHAN.map((n) => semua.find((w) => w.nama_wisata === n)).filter(Boolean).map((w) => <DestCard key={w.id_wisata} w={w} aksi="Lihat destinasi" onPress={() => buka(w.id_wisata)} />)}
      {produk && (
        <View style={[S.panel, S.cream]}>
          <Foto source={TENUN_LEBAR} aspect={816 / 240} label="Kain Tenun Gelo berwarna-warni" />
          <T style={S.kicker}>Dari {tomia.nama_wisata.split(' ')[0]} · UMKM lokal</T>
          <T style={S.h2}>Bukan sekadar oleh-oleh.</T>
          <T>Kenali {produk.nama_produk}, kain berwarna-warni yang bisa dipilih bersama tiket {tomia.nama_wisata}.</T>
          <T style={[S.h2, { color: C.biru }]}>{rp(produk.harga)}</T>
          <T style={S.muted}>Opsional · Diambil di destinasi yang sama. Tidak dikirim.</T>
          <Btn primary title={`Lihat ${produk.nama_produk} →`} onPress={() => buka(tomia.id_wisata)} />
        </View>
      )}
      <T style={[S.kicker, { marginTop: 12 }]}>Sebelum berangkat</T>
      <T style={S.h2}>Pesan dengan tenang.</T>
      <T>1. Pilih destinasi di Jelajah.{'\n'}2. Atur tanggal, jumlah orang, dan produk UMKM jika ada.{'\n'}3. Periksa rincian dan total, lalu Buat pesanan.{'\n'}4. Buka tab Tiket dan tunjukkan ID kepada petugas.</T>
      <T>Tiket berlaku tujuh hari sejak tanggal kunjungan (inklusif). Produk UMKM tidak wajib dan diambil di destinasi yang sama.</T>
      <Note>Pembayaran bersifat simulasi: tidak ada dana yang dibebankan.</Note>
    </Screen>
  )}</Loaded>;
}
