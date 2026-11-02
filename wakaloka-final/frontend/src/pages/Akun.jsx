import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useAsync, usePageTitle } from '../hooks.js';
import { Loaded } from '../components/ui.jsx';

export default function Akun() {
  usePageTitle('Akun');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const state = useAsync(() => api.get('/me'), []);
  return <Loaded state={state}>{(u) => {
    const ini = u.nama.split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
    const petugas = u.role === 'petugas';
    return (
      <div className="wrap"><p className="kicker">{petugas ? 'Ruang petugas' : 'Ruang wisatawan'}</p><h1>Akun pengguna</h1>
        <p className="lead" style={{ margin: '8px 0 20px' }}>Informasi akun dan akses ke perjalanan milikmu.</p>
        <div className="row2 top-align">
          <section className="panel stack"><div style={{ display: 'flex', gap: 16, alignItems: 'center' }}><div className="avatar" aria-hidden="true">{ini}</div>
            <div><h2 style={{ fontSize: 20 }}>{u.nama}</h2><p className="muted" style={{ margin: 0 }}>{u.email} · {u.no_telp}</p><span className="badge aktif">{petugas ? 'Petugas Loket' : 'Wisatawan'}</span></div></div>
            <button className="btn btn-b" onClick={() => { logout(); navigate('/start'); }}>Keluar</button></section>
          <section className="panel cream stack"><h2 style={{ fontSize: 20 }}>Perjalananmu, dalam satu tempat.</h2>
            {petugas ? <><p>Periksa dan validasi tiket pengunjung di loket.</p><Link className="btn btn-p btn-b" to="/validasi">Validasi tiket →</Link></>
              : <><p>Buka tiket untuk menunjukkan ID di destinasi, atau lihat rincian pesanan pada riwayat.</p><Link className="btn btn-p btn-b" to="/riwayat">Tiket saya →</Link><Link className="btn btn-b" to="/riwayat">Riwayat pesanan →</Link>
                <p className="muted" style={{ margin: 0 }}>Riwayat hanya menampilkan pesanan milik akun ini.</p></>}</section>
        </div>
      </div>
    );
  }}</Loaded>;
}
