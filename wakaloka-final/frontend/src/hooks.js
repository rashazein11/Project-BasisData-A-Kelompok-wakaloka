import { useEffect, useRef, useState } from 'react';

export const usePageTitle = (t) => useEffect(() => { document.title = `${t} · Wakaloka`; }, [t]);

// Ambil data; hasil halaman lama dibuang jika pengguna sudah pindah (tidak menimpa halaman baru).
export function useAsync(fn, deps) {
  const [s, setS] = useState({ loading: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    setS({ loading: true });
    fn().then((data) => live && setS({ data }), (error) => live && setS({ error }));
    return () => { live = false; };
  }, [...deps, n]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...s, retry: () => setN((x) => x + 1) };
}

// Galat per kolom: ditampilkan di bawah kolom, kolom pertama yang salah langsung difokuskan.
export function useFormErrors() {
  const [errors, setErrors] = useState({});
  const ref = useRef(null);
  useEffect(() => { ref.current?.querySelector('[aria-invalid="true"]')?.focus(); }, [errors]);
  const clear = () => setErrors((e) => (Object.keys(e).length ? {} : e));
  // true jika ada galat server yang cocok dengan kolom di formulir; false = tampilkan sebagai peringatan umum.
  const setServer = (detail = []) => {
    const shown = detail.filter((d) => ref.current?.elements[d.field]);
    if (shown.length) setErrors(Object.fromEntries(shown.map((d) => [d.field, d.pesan])));
    return shown.length > 0;
  };
  return { errors, setErrors, ref, clear, setServer };
}
