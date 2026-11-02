// Komponen yang dipakai ulang di banyak layar (padanan components/ui.jsx di versi web).
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { C, S, T } from '../theme';
import { rp, bintang } from '../format';
import { foto } from '../images';

// Foto selalu pas selebar wadahnya: wadah berukuran tetap (lebar penuh x rasio), foto mengisi dan dipotong (cover).
// Foto tidak diberi lebar sendiri, sebab ukuran aslinya bisa melebihi layar HP.
export const Foto = ({ source, aspect, label, style }) => (
  <View style={[{ width: '100%', aspectRatio: aspect, overflow: 'hidden', borderRadius: 4 }, style]}>
    <Image source={source} accessibilityLabel={label} resizeMode="cover" style={StyleSheet.absoluteFill} />
  </View>
);

// Halaman yang bisa digulir; ketukan di luar kolom tetap diteruskan ke tombol.
export const Screen = ({ children }) => <ScrollView style={S.screen} contentContainerStyle={S.body} keyboardShouldPersistTaps="handled">{children}</ScrollView>;

export function Btn({ title, onPress, primary, disabled, style }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress}
      style={[{ minHeight: 48, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1.5, borderColor: primary ? C.yellow : C.ink, backgroundColor: primary ? C.yellow : 'transparent', alignItems: 'center', justifyContent: 'center' },
        disabled && { backgroundColor: '#D6D6BF', borderColor: '#D6D6BF' }, style]}>
      <T style={S.bold}>{title}</T>
    </Pressable>
  );
}

// Pesan galat umum (mis. login gagal, server tidak terjangkau).
export const AlertBox = ({ msg }) => (msg ? <View style={S.alert} accessibilityRole="alert"><T style={{ color: C.err }}>{msg}</T></View> : null);
export const Note = ({ children }) => <View style={S.note}><T style={{ fontSize: 12 }}>{children}</T></View>;

// Kolom formulir: label terlihat, petunjuk atau galat di bawah kolom.
export function Field({ label, hint, error, secure, ...input }) {
  const [tampil, setTampil] = useState(false);
  return (
    <View style={{ gap: 4 }}>
      <T style={S.bold}>{label}</T>
      <View style={S.row}>
        <TextInput accessibilityLabel={label} placeholderTextColor="#8a8a70" autoCapitalize="none" autoCorrect={false}
          secureTextEntry={secure && !tampil}
          style={{ flex: 1, minHeight: 48, borderWidth: 1.5, borderColor: error ? C.err : C.ink, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', color: C.ink }} {...input} />
        {secure && <Btn title={tampil ? 'Sembunyikan' : 'Tampilkan'} onPress={() => setTampil(!tampil)} />}
      </View>
      {(error || hint) ? <T style={[S.muted, error && { color: C.err, opacity: 1 }]}>{error || hint}</T> : null}
    </View>
  );
}

export function Stepper({ label, value, min, max, onChange }) {
  const step = (d) => onChange(String(Math.min(max, Math.max(min, (parseInt(value, 10) || 0) + d))));
  return (
    <View style={{ gap: 4 }}>
      <T style={S.bold}>{label}</T>
      <View style={S.row}>
        <Btn title="−" onPress={() => step(-1)} style={{ width: 52, paddingHorizontal: 0 }} />
        <TextInput accessibilityLabel={label} keyboardType="number-pad" value={value} onChangeText={onChange}
          style={{ flex: 1, minHeight: 48, borderWidth: 1.5, borderColor: C.ink, borderRadius: 8, textAlign: 'center', backgroundColor: '#fff', color: C.ink }} />
        <Btn title="+" onPress={() => step(1)} style={{ width: 52, paddingHorizontal: 0 }} />
      </View>
      <T style={S.muted}>Minimal {min}.</T>
    </View>
  );
}

export const Badge = ({ status, children }) => (
  <View style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: status === 'kedaluwarsa' ? C.err : C.ink, backgroundColor: status === 'aktif' ? C.ok : status === 'kedaluwarsa' ? '#f6d6cf' : '#D6D6BF' }}>
    <T style={[S.bold, { fontSize: 12 }, status === 'kedaluwarsa' && { color: C.err }]}>{children}</T>
  </View>
);

export const DestCard = ({ w, aksi, onPress }) => (
  <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 4, paddingBottom: 16, gap: 8 }}>
    <Foto source={foto(w.foto)} aspect={406 / 260} label={`Foto ${w.nama_wisata}`} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
    <View style={{ paddingHorizontal: 12, gap: 6 }}>
      <T style={S.muted}>{w.kategori}</T>
      <T style={S.h2}>{w.nama_wisata}</T>
      <View style={[S.between, { backgroundColor: C.yellow, padding: 8, borderRadius: 4 }]}><T style={S.bold}>{rp(w.harga_tiket)}</T><T style={S.bold}>{bintang(w.rating)}</T></View>
      <T>{w.deskripsi}</T>
      <T style={S.muted}>{w.umkm?.length ? `UMKM: ${w.umkm.join(', ')} · Opsional` : 'Produk UMKM belum tersedia'}</T>
      <Btn title={`${aksi} →`} onPress={onPress} />
    </View>
  </View>
);

// Menampilkan status muat / galat dari useAsync, lalu isi layar saat data siap.
export function Loaded({ state, children }) {
  if (state.loading) return <View style={[S.screen, { justifyContent: 'center' }]}><ActivityIndicator size="large" color={C.olive} /></View>;
  if (state.error) return <Screen><AlertBox msg={state.error.message || 'Halaman gagal dimuat.'} /><Btn title="Coba lagi" onPress={state.retry} /></Screen>;
  return children(state.data);
}
