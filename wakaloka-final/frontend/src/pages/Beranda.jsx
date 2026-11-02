import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { rp } from '../format.js';
import { useAsync, usePageTitle } from '../hooks.js';
import { DestCard, Loaded } from '../components/ui.jsx';

const PILIHAN = ['Goa Kontamale', 'Pulau Hoga', 'Tomia Puncak Khayangan'];

// Dipakai Beranda dan Galeri: semua destinasi + produk UMKM pertama (Tenun Gelo).
export const muatDenganUmkm = async () => {
  const semua = await api.get('/destinations');
  const tomia = semua.find((w) => w.umkm.length);
  const produk = tomia && (await api.get(`/destinations/${tomia.id_wisata}`)).produk_umkm[0];
  return { semua, tomia, produk };
};

export default function Beranda() {
  usePageTitle('Beranda');
  const state = useAsync(muatDenganUmkm, []);
  return <Loaded state={state}>{({ semua, tomia, produk }) => {
    const pilih = PILIHAN.map((n) => semua.find((w) => w.nama_wisata === n)).filter(Boolean);
    const kota = tomia?.nama_wisata.split(' ')[0];
    return (
      <div className="wrap">
        <section className="row2">
          <div>
            <p className="kicker">Catatan perjalanan dari Wakatobi</p>
            <h1>Jelajahi pulau. Bawa pulang cerita lokal.</h1>
            <p className="lead">Dari sabana Tomia hingga biru Pulau Hoga. Temukan destinasi, pesan tiket, dan kenali karya warga di sepanjang perjalanan.</p>
            <Link className="btn btn-p" to="/jelajah">Jelajahi destinasi →</Link>
          </div>
          <figure style={{ margin: 0 }}><img src="assets/img/hero.jpg" alt="Foto udara pulau berhutan dikelilingi laut biru" width="620" height="580" fetchpriority="high" /><figcaption className="muted">Wakatobi · Sulawesi Tenggara</figcaption></figure>
        </section>
        <hr />
        <p className="kicker" style={{ marginTop: 32 }}>Pilihan perjalanan</p>
        <h2 style={{ marginBottom: 16 }}>Tiga cara mengenal Wakatobi.</h2>
        <div className="grid">{pilih.map((w) => <DestCard key={w.id_wisata} w={w} aksi="Lihat destinasi" />)}</div>
        <p className="muted" style={{ marginTop: 12 }}>Enam destinasi tersedia di Jelajah, Galeri, dan Data tarif.</p>
        {produk && (
          <section className="band">
            <div className="tenun" role="img" aria-label="Kain Tenun Gelo berwarna-warni"></div>
            <div><p className="kicker">Dari {kota} · UMKM lokal</p><h2>Bukan sekadar oleh-oleh.</h2>
              <p>Kenali {produk.nama_produk}, kain berwarna-warni yang bisa dipilih bersama tiket {tomia.nama_wisata}.</p>
              <p className="total" style={{ color: '#2c5b78' }}>{rp(produk.harga)}</p>
              <p className="muted">Opsional · Diambil di destinasi {kota} yang sama. Tidak dikirim.</p>
              <Link className="btn btn-p" to={`/destinasi/${tomia.id_wisata}`}>Lihat {produk.nama_produk} di {kota} →</Link></div>
          </section>
        )}
        <section className="row2 top-align">
          <div><p className="kicker">Sebelum berangkat</p><h2>Pesan dengan tenang.</h2>
            <ol className="steps" style={{ marginTop: 12 }}>
              <li><b>Pilih destinasi.</b> Buka Jelajah, lalu periksa foto, tarif, dan rating.</li>
              <li><b>Atur kunjungan.</b> Pilih tanggal, jumlah orang, dan produk UMKM jika tersedia.</li>
              <li><b>Periksa pesanan.</b> Tinjau rincian dan total, lalu pilih Buat pesanan.</li>
              <li><b>Tunjukkan tiket.</b> Buka Tiket saya dan tunjukkan ID kepada petugas.</li>
            </ol></div>
          <div><h3 style={{ fontSize: 20 }}>Simpan ID, bukan kode pindai.</h3>
            <p style={{ marginTop: 8 }}>Tiket ditunjukkan kepada petugas loket untuk pencarian ID secara manual. Membuka atau mencari tiket tidak menandainya sebagai digunakan.</p>
            <dl><dt>Apakah produk UMKM wajib?</dt><dd>Tidak. Tiket dapat dipesan tanpa produk UMKM.</dd>
              <dt>Di mana produk diambil?</dt><dd>Di destinasi yang sama dengan tiket. Wakaloka tidak menyediakan pengiriman.</dd>
              <dt>Bagaimana masa berlaku tiket?</dt><dd>Tujuh hari sejak tanggal kunjungan, inklusif. Setelah itu tiket ditolak.</dd></dl>
            <p className="note" style={{ marginTop: 12 }}>Pembayaran bersifat simulasi: tidak ada dana yang dibebankan.</p></div>
        </section>
      </div>
    );
  }}</Loaded>;
}
