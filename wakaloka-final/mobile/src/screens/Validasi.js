import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../api';
import { rp, tgl, STATUS } from '../format';
import { S, T } from '../theme';
import { AlertBox, Badge, Btn, Field, Note, Screen } from '../components/ui';

const HINT = 'Pencarian hanya membaca data. Tiket belum berubah menjadi digunakan sampai Anda memilih Validasi tiket.';

export default function Validasi() {
  const [idt, setIdt] = useState(''), [errId, setErrId] = useState(''), [t, setT] = useState(null), [pesan, setPesan] = useState(''), [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(''); // '' | 'cari' | 'val'

  async function cari() {
    setT(null); setAlert(''); setPesan('');
    const id = idt.trim();
    if (!id) return setErrId('ID tiket wajib diisi.');
    setBusy('cari');
    try { setT(await api.get(`/staff/tickets/${encodeURIComponent(id)}`)); }
    catch (e) { setAlert(e.status === 404 ? 'ID tiket tidak ditemukan. Periksa kembali ID yang ditunjukkan pengunjung.' : e.message); }
    setBusy('');
  }
  async function validasi() {
    setBusy('val'); setAlert('');
    try { await api.post(`/staff/tickets/${t.id_tiket}/validate`, {}); setT({ ...t, status: 'terpakai' }); setPesan('Tiket berhasil divalidasi dan sekarang ditandai digunakan.'); }
    catch (e) { setAlert(e.message); }
    setBusy('');
  }
  const batal = () => { setT(null); setAlert(''); setPesan(''); setIdt(''); };
  const aktif = t?.status === 'aktif';

  return (
    <Screen>
      <T style={S.kicker}>Ruang petugas · Akses terbatas</T>
      <T style={S.h1}>Periksa dahulu. Validasi setelah pasti.</T>
      <Field label="ID tiket pengunjung" hint={HINT} error={errId} value={idt} onChangeText={(x) => { setIdt(x); setErrId(''); }} />
      <Btn primary title={busy === 'cari' ? 'Memproses…' : 'Cari tiket'} disabled={busy === 'cari'} onPress={cari} />
      <AlertBox msg={alert} />
      {t && (
        <View style={S.panel}>
          <T style={S.kicker}>Hasil pencarian</T>
          <Badge status={t.status}>{aktif ? 'Valid · ' : ''}{STATUS[t.status]}</Badge>
          <T style={S.h2}>{t.nama_wisata}</T>
          <T>ID tiket: {t.id_tiket}{'\n'}Pemilik: {t.pemilik}{'\n'}Kunjungan: {tgl(t.tgl_kunjungan)}{'\n'}Jumlah: {t.jumlah_orang} orang{'\n'}Berlaku sampai: {tgl(t.tgl_berlaku)} inklusif{'\n'}{t.rincian.length ? t.rincian.map((r) => `${r.nama_produk} × ${r.jumlah}`).join(', ') : 'Tanpa produk UMKM'} · {rp(t.total)}</T>
          {pesan ? <Note>{pesan}</Note> : null}
          {aktif ? (
            <>
              <T style={S.bold}>Konfirmasi pemakaian tiket</T>
              <T style={S.muted}>Setelah divalidasi, tiket ditandai digunakan dan tidak dapat digunakan kembali.</T>
              <Btn primary title={busy === 'val' ? 'Memproses…' : 'Validasi tiket'} disabled={busy === 'val'} onPress={validasi} />
            </>
          ) : <AlertBox msg={`Tiket ini tidak dapat divalidasi (${STATUS[t.status].toLowerCase()}).`} />}
          <Btn title="Batal / cari ID lain" onPress={batal} />
        </View>
      )}
      <Note>Tidak perlu pemindaian QR. Gunakan ID yang ditunjukkan pengunjung. Cocokkan destinasi, tanggal berlaku, dan jumlah pengunjung.</Note>
    </Screen>
  );
}
