import { View } from 'react-native';
import { api } from '../api';
import { useAuth } from '../auth';
import { useAsync } from '../hooks';
import { C, S, T } from '../theme';
import { Btn, Loaded, Screen } from '../components/ui';

export default function Akun({ navigation }) {
  const { user } = useAuth();
  if (!user) return (
    <Screen>
      <T style={S.kicker}>Akun</T><T style={S.h1}>Masuk ke Wakaloka.</T>
      <T>Masuk atau daftar untuk memesan tiket dan melihat riwayat. Menjelajah destinasi tidak perlu akun.</T>
      <Btn primary title="Masuk" onPress={() => navigation.navigate('Login')} />
      <Btn title="Daftar" onPress={() => navigation.navigate('Daftar')} />
    </Screen>
  );
  return <Profil navigation={navigation} />;
}

function Profil({ navigation }) {
  const { logout } = useAuth();
  const state = useAsync(() => api.get('/me'), []);
  return <Loaded state={state}>{(u) => {
    const ini = u.nama.split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
    const petugas = u.role === 'petugas';
    return (
      <Screen>
        <T style={S.kicker}>{petugas ? 'Ruang petugas' : 'Ruang wisatawan'}</T>
        <T style={S.h1}>Akun pengguna</T>
        <View style={S.panel}>
          <View style={S.row}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' }}><T style={S.h2}>{ini}</T></View>
            <View style={{ flex: 1 }}><T style={S.h2}>{u.nama}</T><T style={S.muted}>{u.email} · {u.no_telp}</T><T style={S.bold}>{petugas ? 'Petugas Loket' : 'Wisatawan'}</T></View>
          </View>
          <Btn title="Keluar" onPress={logout} />
        </View>
        <View style={[S.panel, S.cream]}>
          <T style={S.h2}>Perjalananmu, dalam satu tempat.</T>
          <T>{petugas ? 'Periksa dan validasi tiket pengunjung di loket.' : 'Buka tiket untuk menunjukkan ID di destinasi, atau lihat rincian pesanan pada riwayat.'}</T>
          <Btn primary title={petugas ? 'Validasi tiket →' : 'Tiket saya →'} onPress={() => navigation.navigate('Tiket')} />
        </View>
      </Screen>
    );
  }}</Loaded>;
}
