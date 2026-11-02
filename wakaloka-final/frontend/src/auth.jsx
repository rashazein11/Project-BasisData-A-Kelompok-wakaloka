// shortcut: token disimpan di localStorage (rentan XSS bila ada celah skrip); React meng-escape semua teks dinamis.
// Upgrade ke cookie httpOnly jika backend dan frontend berbagi domain.
import { createContext, useContext, useEffect, useState } from 'react';

const K = 'wk_token', U = 'wk_user';
const safe = (fn, fb) => { try { return fn(); } catch { return fb; } };
export const getToken = () => safe(() => localStorage.getItem(K), null);
const readUser = () => safe(() => JSON.parse(localStorage.getItem(U)), null);
export const clearSession = () => { safe(() => { localStorage.removeItem(K); localStorage.removeItem(U); }); window.dispatchEvent(new Event('wk-logout')); };

const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  useEffect(() => { const h = () => setUser(null); window.addEventListener('wk-logout', h); return () => window.removeEventListener('wk-logout', h); }, []);
  const login = (token, u) => { safe(() => { localStorage.setItem(K, token); localStorage.setItem(U, JSON.stringify(u)); }); setUser(u); };
  return <Ctx.Provider value={{ user, login, logout: clearSession }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
