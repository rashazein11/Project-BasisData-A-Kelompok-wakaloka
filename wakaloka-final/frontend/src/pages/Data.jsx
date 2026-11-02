import { api } from '../api.js';
import { rp } from '../format.js';
import { useAsync, usePageTitle } from '../hooks.js';
import { Loaded } from '../components/ui.jsx';

export default function Data() {
  usePageTitle('Data tarif');
  const state = useAsync(() => api.get('/destinations'), []);
  return <Loaded state={state}>{(semua) => (
    <div className="wrap">
      <p className="kicker">Data / tarif dan pemesanan</p><h1>Tarif yang mudah dibaca.</h1>
      <p className="lead" style={{ margin: '8px 0 20px' }}>Harga tiket dan rating enam destinasi diambil langsung dari data Wakaloka.</p>
      <div className="row2 top-align">
        <div className="panel"><h2 style={{ fontSize: 20, marginBottom: 8 }}>Tarif dan rating destinasi</h2>
          <div className="scroll"><table><caption className="sr">Tarif dan rating destinasi</caption>
            <thead><tr><th scope="col">Destinasi</th><th scope="col" className="n">Harga tiket</th><th scope="col" className="n">Rating</th></tr></thead>
            <tbody>{semua.map((w) => <tr key={w.id_wisata}><th scope="row" style={{ fontWeight: 500 }}>{w.nama_wisata}</th><td className="n">{rp(w.harga_tiket)}</td><td className="n">{w.rating.toFixed(1).replace('.', ',')}</td></tr>)}</tbody></table></div></div>
        <div className="panel cream"><h2 style={{ fontSize: 20, marginBottom: 8 }}>Cara menghitung total</h2>
          <p>Total = (harga tiket × jumlah orang) + jumlah semua (harga produk UMKM × jumlah produk).</p>
          <p><b>Contoh:</b> 1 orang ke Tomia dengan 1 Tenun Gelo = {rp(25000)} + {rp(190000)} = <b>{rp(215000)}</b>.</p>
          <p>Tiket berlaku tujuh hari sejak tanggal kunjungan (inklusif). Tanpa UMKM: {rp(25000)}. 2 orang + 1 Tenun Gelo: {rp(240000)}.</p>
          <p className="note">Pembayaran bersifat simulasi; tidak ada dana yang dibebankan.</p></div>
      </div>
    </div>
  )}</Loaded>;
}
