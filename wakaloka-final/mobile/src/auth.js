// shortcut: token disimpan di SecureStore (terenkripsi oleh sistem) dan juga di memori; cukup untuk tugas, tanpa refresh token.
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

let token = null;
let expire = () => {};
export const getToken = () => token;
export const sessionExpired = () => expire(); // dipanggil api.js saat server menjawab 401

const K = 'wk_token', U = 'wk_user';
const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ ready: false, user: null });

  useEffect(() => {
    (async () => {
      try {
        token = await SecureStore.getItemAsync(K);
        const u = await SecureStore.getItemAsync(U);
        setState({ ready: true, user: token && u ? JSON.parse(u) : null });
      } catch { setState({ ready: true, user: null }); }
    })();
  }, []);

  const login = async (t, u) => {
    token = t;
    try { await SecureStore.setItemAsync(K, t); await SecureStore.setItemAsync(U, JSON.stringify(u)); } catch { /* sesi tetap jalan di memori */ }
    setState({ ready: true, user: u });
  };
  const logout = async () => {
    token = null;
    try { await SecureStore.deleteItemAsync(K); await SecureStore.deleteItemAsync(U); } catch { /* abaikan */ }
    setState({ ready: true, user: null });
  };
  expire = logout;
  return <Ctx.Provider value={{ ...state, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
