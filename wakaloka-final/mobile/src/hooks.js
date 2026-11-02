import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Ambil data; hasil lama dibuang jika layar sudah berganti.
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

// Seperti useAsync, tetapi memuat ulang setiap layar (tab) kembali dibuka, agar pesanan baru langsung terlihat.
export function useFocusAsync(fn) {
  const s = useAsync(fn, []);
  const pertama = useRef(true);
  useFocusEffect(useCallback(() => { if (pertama.current) pertama.current = false; else s.retry(); }, [])); // eslint-disable-line react-hooks/exhaustive-deps
  return s;
}

// Isi formulir + galat per kolom. Mengetik di kolom menghapus galat kolom itu.
export function useForm(awal) {
  const [v, setV] = useState(awal);
  const [errors, setErrors] = useState({});
  const set = (k) => (x) => { setV((p) => ({ ...p, [k]: x })); setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e)); };
  // true jika galat server cocok dengan kolom di formulir; false = tampilkan sebagai peringatan umum.
  const setServer = (detail = []) => {
    const cocok = detail.filter((d) => d.field in awal);
    if (cocok.length) setErrors(Object.fromEntries(cocok.map((d) => [d.field, d.pesan])));
    return cocok.length > 0;
  };
  return { v, set, errors, setErrors, setServer };
}
