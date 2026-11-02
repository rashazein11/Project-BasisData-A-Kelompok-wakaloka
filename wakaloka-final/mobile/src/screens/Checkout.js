import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { api } from '../api';
import { useAuth } from '../auth';
import { rp, tgl, tglPendek, hariIni, tambahHari } from '../format';
import { useAsync } from '../hooks';
import { C, S, T } from '../theme';
import { AlertBox, Btn, Loaded, Note, Screen, Stepper } from '../components/ui';

// shortcut: tanggal dipilih dari 30 hari ke depan (tanpa pustaka kalender); upgrade ke date picker bila perlu tanggal lebih jauh.
const HARI_PILIHAN = 30;

export default function Checkout({ route, navigation }) {
  const state = useAsync(() => api.get(`/destinations/${route.params.id}`), [route.params.id]);
  return <Loaded state={state}>{(w) => <Form w={w} navigation={navigation} />}</Loaded>;
}

function Form({ w, navigation }) {
  const { user } = useAuth();
  const today = hariIni();
  const [kunjungan, setKunjungan] = useState(''), [orangStr, setOrang] = useState('1'), [jml, setJml] = useState({});
  const [errTgl, setErrTgl] = useState(''), [alert, setAlert] = useState(''), [busy, setBusy] = useState(false);

  // Hanya untuk tampilan; total resmi dihitung ulang oleh server (BR-03).
  const orang = Math.max(1, parseInt(orangStr, 10) || 0);
  const items = w.produk_umkm.map((p) => ({ p, n: Math.max(0, parseInt(jml[p.id_produk], 10) || 0) })).filter((i) => i.n > 0);
  const total = w.harga_tiket * orang + items.reduce((s, i) => s + i.p.harga * i.n, 0);

  async function submit() {
    setAlert('');
    if (!kunjungan) return setErrTgl('Tanggal kunjungan wajib diisi.');
    setBusy(true);
    try {
      const r = await api.post('/orders', { id_wisata: w.id_wisata, tgl_kunjungan: kunjungan, jumlah_orang: orang, produk: items.map((i) => ({ id_produk: i.p.id_produk, jumlah: i.n })) });
      navigation.replace('Etiket', { id: r.tiket.id_tiket, baru: true });
    } catch (e) {
      const d = e.detail.find((x) => x.field === 'tgl_kunjungan');
      if (d) setErrTgl(d.pesan); else setAlert(e.message);
      setBusy(false);
    }
  }

  return (
    <Screen>
      <T style={S.h1}>Periksa rencana perjalananmu.</T>
      <T style={S.h2}>{w.nama_wisata}</T>
      <T style={S.muted}>Pemesan: {user.nama} · {user.email}</T>
      <AlertBox msg={alert} />
      <T style={S.bold}>Tanggal kunjungan · wajib</T>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {Array.from({ length: HARI_PILIHAN }, (_, i) => tambahHari(today, i)).map((d) => (
          <Pressable key={d} accessibilityRole="button" accessibilityState={{ selected: d === kunjungan }} onPress={() => { setKunjungan(d); setErrTgl(''); }}
            style={{ minHeight: 48, minWidth: 76, borderRadius: 8, borderWidth: 1.5, borderColor: C.ink, backgroundColor: d === kunjungan ? C.yellow : '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <T style={S.bold}>{tglPendek(d)}</T>
          </Pressable>
        ))}
      </ScrollView>
      {errTgl ? <T style={{ color: C.err }}>{errTgl}</T> : null}
      <Stepper label="Jumlah pengunjung" value={orangStr} min={1} max={50} onChange={setOrang} />
      {w.produk_umkm.length ? (
        <>
          <T style={S.h2}>Produk UMKM · Opsional</T>
          <T style={S.muted}>Diambil di destinasi, tidak dikirim. Atur ke 0 untuk tanpa UMKM.</T>
          {w.produk_umkm.map((p) => (
            <View key={p.id_produk} style={{ gap: 4 }}>
              <T style={S.bold}>{p.nama_produk} · {rp(p.harga)}</T>
              <Stepper label={`Jumlah ${p.nama_produk}`} value={jml[p.id_produk] ?? '0'} min={0} max={20} onChange={(x) => setJml({ ...jml, [p.id_produk]: x })} />
            </View>
          ))}
        </>
      ) : <T style={S.muted}>Produk UMKM belum tersedia untuk destinasi ini.</T>}
      <Note>{kunjungan ? `Berlaku sampai ${tgl(tambahHari(kunjungan, 7))} inklusif. Setelah tanggal tersebut tiket ditolak.` : 'Tiket berlaku tujuh hari sejak tanggal kunjungan (inklusif).'}</Note>
      <View style={[S.panel, S.orange]}>
        <T style={S.h2}>Ringkasan pesanan</T>
        <T>{w.nama_wisata}{'\n'}{orang} orang × {rp(w.harga_tiket)}</T>
        {items.map((i) => <T key={i.p.id_produk}>{i.p.nama_produk}{'\n'}{i.n} produk × {rp(i.p.harga)}</T>)}
        <T style={S.bold}>Total simulasi</T>
        <T style={S.h1} accessibilityLiveRegion="polite">{rp(total)}</T>
        <Btn primary title={busy ? 'Memproses…' : 'Buat pesanan'} disabled={busy} onPress={submit} />
        <T style={S.muted}>Simulasi tanpa pembayaran. Menekan Buat pesanan tidak membebankan dana.</T>
      </View>
    </Screen>
  );
}
