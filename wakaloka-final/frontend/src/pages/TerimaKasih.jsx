import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { tgl } from '../format.js';
import { useAsync, usePageTitle } from '../hooks.js';
import { Loaded } from '../components/ui.jsx';

export default function TerimaKasih() {
  usePageTitle('Terima kasih');
  const { id } = useParams();
  const state = useAsync(async () => (id ? api.get(`/me/tickets/${id}`) : null), [id]);
  return <Loaded state={state}>{(t) => (
    <div className="wrap" style={{ maxWidth: 720, textAlign: 'center' }}>
      <h1>Terima kasih sudah singgah.</h1>
      <p className="lead" style={{ margin: '12px auto' }}>{t ? `Rencana ke ${t.nama_wisata} pada ${tgl(t.tgl_kunjungan)} sudah tercatat.` : 'Pesananmu sudah tercatat.'}</p>
      <p className="note">Pembayaran bersifat simulasi: tidak ada dana yang dibebankan.</p>
      <div className="stack" style={{ maxWidth: 360, margin: '20px auto' }}><Link className="btn btn-p btn-b" to="/beranda">Kembali ke Beranda</Link>{t && <Link className="btn btn-b" to={`/tiket/${t.id_tiket}`}>Lihat e-tiket</Link>}</div>
    </div>
  )}</Loaded>;
}
