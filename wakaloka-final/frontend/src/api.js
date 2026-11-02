import { getToken, clearSession } from './auth.jsx';

// Alamat backend. Atur lewat VITE_API_BASE di frontend/.env bila backend ada di server lain.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(status, data) {
    super(data?.pesan || 'Terjadi kesalahan.');
    Object.assign(this, { status, kode: data?.kode, detail: data?.detail || [] });
  }
}

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(getToken() && { Authorization: `Bearer ${getToken()}` }) },
      body: body && JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, { pesan: 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.' });
  }
  const data = await res.json().catch(() => null);
  if (res.status === 401 && getToken() && path !== '/auth/login') { clearSession(); location.hash = '#/login'; } // sesi berakhir
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

// Satu-satunya tempat frontend memanggil backend.
export const api = { get: (p) => request('GET', p), post: (p, b) => request('POST', p, b) };
