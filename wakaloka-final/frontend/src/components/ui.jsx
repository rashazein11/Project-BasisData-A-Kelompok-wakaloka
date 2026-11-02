// Komponen yang dipakai ulang di banyak layar.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rp, bintang } from '../format.js';

export const Logo = () => <img src="assets/img/logo.png" alt="" width="34" height="32" />;

// Wadah role="alert" selalu ada agar pembaca layar membacakan pesan yang muncul.
export const Alert = ({ msg, style }) => <div role="alert" style={style}>{msg && <div className="alert">{msg}</div>}</div>;

// Kolom formulir: label terlihat, petunjuk atau galat di bawah kolom.
export function Field({ id, label, hint = '', error, extra, type = 'text', autoComplete = 'off', ...input }) {
  const el = <input id={id} name={id} type={type} autoComplete={autoComplete} aria-describedby={`${id}-m`} aria-invalid={error ? 'true' : undefined} {...input} />;
  return (
    <div className="field"><label htmlFor={id}>{label}</label>
      {extra ? <div className="pw">{el}{extra}</div> : el}
      <div id={`${id}-m`} className={error ? 'err' : 'hint'}>{error || hint}</div></div>
  );
}

export function PasswordField(props) {
  const [show, setShow] = useState(false);
  return <Field {...props} type={show ? 'text' : 'password'}
    extra={<button type="button" className="btn" aria-pressed={show} onClick={() => setShow(!show)}>{show ? 'Sembunyikan' : 'Tampilkan'}</button>} />;
}

export function Stepper({ id, label, value, min, max, onChange }) {
  const step = (d) => onChange(String(Math.min(max, Math.max(min, (parseInt(value, 10) || 0) + d))));
  return (
    <div className="field"><label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button type="button" className="btn" aria-label={`Kurangi ${label}`} onClick={() => step(-1)}>−</button>
        <input id={id} name={id} type="number" inputMode="numeric" min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={`${id}-m`} />
        <button type="button" className="btn" aria-label={`Tambah ${label}`} onClick={() => step(1)}>+</button>
      </div>
      <div id={`${id}-m`} className="hint">Minimal {min}.</div></div>
  );
}

export const DestCard = ({ w, aksi }) => (
  <article className="card">
    <img src={w.foto} alt={`Foto ${w.nama_wisata}`} width="406" height="260" loading="lazy" />
    <small className="muted">{w.kategori}</small>
    <h3>{w.nama_wisata}</h3>
    <div className="price"><span>{rp(w.harga_tiket)}</span><span>{bintang(w.rating)}</span></div>
    <p>{w.deskripsi}</p>
    <small className="muted">{w.umkm?.length ? `UMKM: ${w.umkm.join(', ')} · Opsional` : 'Produk UMKM belum tersedia'}</small>
    <Link className="btn" to={`/destinasi/${w.id_wisata}`}>{aksi} →</Link>
  </article>
);

// Menampilkan status muat / galat dari useAsync, lalu isi halaman saat data siap.
export function Loaded({ state, children }) {
  if (state.loading) return <p className="wrap" role="status">Memuat…</p>;
  if (state.error) return <div className="wrap"><Alert msg={state.error.message || 'Halaman gagal dimuat.'} /><button className="btn" onClick={state.retry}>Coba lagi</button></div>;
  return children(state.data);
}
