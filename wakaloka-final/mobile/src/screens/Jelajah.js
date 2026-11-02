import { useState } from 'react';
import { api } from '../api';
import { useAsync } from '../hooks';
import { S, T } from '../theme';
import { DestCard, Field, Loaded, Screen } from '../components/ui';

export default function Jelajah({ navigation }) {
  const state = useAsync(() => api.get('/destinations'), []);
  const [q, setQ] = useState('');
  return <Loaded state={state}>{(semua) => {
    const hasil = semua.filter((w) => w.nama_wisata.toLowerCase().includes(q.trim().toLowerCase()));
    return (
      <Screen>
        <T style={S.kicker}>Panduan destinasi</T>
        <T style={S.h1}>Ke mana langkahmu berikutnya?</T>
        <Field label="Cari destinasi" placeholder="Cari nama destinasi…" value={q} onChangeText={setQ} />
        <T style={S.muted}>Semua destinasi · {hasil.length} tempat</T>
        {hasil.map((w) => <DestCard key={w.id_wisata} w={w} aksi="Lihat detail" onPress={() => navigation.navigate('Detail', { id: w.id_wisata })} />)}
        {!hasil.length && <T>Tidak ada destinasi yang cocok. Coba kata lain.</T>}
      </Screen>
    );
  }}</Loaded>;
}
