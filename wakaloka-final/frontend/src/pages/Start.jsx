import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks.js';

export default function Start() {
  usePageTitle('Mulai');
  return (
    <div className="wrap"><section className="row2">
      <div>
        <p className="kicker">Panduan pulau · Wakatobi</p>
        <h1>Jauh dari biasa. Dekat dengan lokal.</h1>
        <p className="lead">Temukan wisata Wakatobi, pesan tiket, dan pilih karya UMKM di destinasi yang sama.</p>
        <div className="stack" style={{ maxWidth: 420 }}><Link className="btn btn-p btn-b" to="/beranda">Mulai menjelajah →</Link><Link className="btn btn-b" to="/login">Masuk ke akun</Link></div>
        <p className="muted" style={{ marginTop: 12 }}>Website responsif · Jelajah dapat dibuka tanpa masuk.</p>
      </div>
      <figure style={{ margin: 0 }}><img src="assets/img/hero.jpg" alt="Foto udara pulau berhutan dikelilingi laut biru di Wakatobi" width="620" height="580" fetchpriority="high" />
        <figcaption className="muted">Wakatobi, Sulawesi Tenggara · Laut dan pulau yang menanti.</figcaption></figure>
    </section></div>
  );
}
