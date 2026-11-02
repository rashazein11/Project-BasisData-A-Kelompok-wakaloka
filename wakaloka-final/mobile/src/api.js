import Constants from 'expo-constants';
import { getToken, sessionExpired } from './auth';

// Di HP, "localhost" adalah HP itu sendiri. Bawaan: alamat laptop yang menjalankan `npm start` (satu Wi-Fi), port 3000.
const host = Constants.expoConfig?.hostUri?.split(':')[0];
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || `http://${host || 'localhost'}:3000/api`;

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
    throw new ApiError(0, { pesan: 'Tidak dapat terhubung ke server. Pastikan backend berjalan dan HP satu Wi-Fi dengan laptop.' });
  }
  const data = await res.json().catch(() => null);
  if (res.status === 401 && getToken() && path !== '/auth/login') sessionExpired(); // sesi berakhir
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

// Satu-satunya tempat aplikasi memanggil backend (sama seperti versi web).
export const api = { get: (p) => request('GET', p), post: (p, b) => request('POST', p, b) };
