import { useState } from 'react';
import { api } from '../api.js';
import { useAsync, usePageTitle } from '../hooks.js';
import { DestCard, Loaded } from '../components/ui.jsx';

export default function Jelajah() {
  usePageTitle('Jelajah');
  const state = useAsync(() => api.get('/destinations'), []);
  const [q, setQ] = useState('');
  return <Loaded state={state}>{(semua) => {
    const hasil = semua.filter((w) => w.nama_wisata.toLowerCase().includes(q.trim().toLowerCase()));
    return (
      <div className="wrap">
        <p className="kicker">Panduan destinasi</p><h1>Ke mana langkahmu berikutnya?</h1>
        <p className="lead" style={{ marginTop: 8 }}>Enam destinasi, dari pesisir hingga sabana. Temukan tempat untuk perjalananmu.</p>
        <div className="field" style={{ maxWidth: 480, marginTop: 20 }}><label htmlFor="cari">Cari destinasi</label>
          <input id="cari" type="search" placeholder="Cari nama destinasi…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <p className="muted" role="status">Semua destinasi · {hasil.length} tempat</p>
        <div className="grid">{hasil.map((w) => <DestCard key={w.id_wisata} w={w} aksi="Lihat detail" />)}</div>
        {!hasil.length && <p>Tidak ada destinasi yang cocok. Coba kata lain.</p>}
      </div>
    );
  }}</Loaded>;
}
