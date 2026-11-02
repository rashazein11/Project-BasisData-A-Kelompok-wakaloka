import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Layout from './components/Layout.jsx';
import Start from './pages/Start.jsx';
import Beranda from './pages/Beranda.jsx';
import Jelajah from './pages/Jelajah.jsx';
import Galeri from './pages/Galeri.jsx';
import Data from './pages/Data.jsx';
import Login from './pages/Login.jsx';
import Daftar from './pages/Daftar.jsx';
import Detail from './pages/Detail.jsx';
import Checkout from './pages/Checkout.jsx';
import Etiket from './pages/Etiket.jsx';
import TerimaKasih from './pages/TerimaKasih.jsx';
import Riwayat from './pages/Riwayat.jsx';
import Akun from './pages/Akun.jsx';
import Validasi from './pages/Validasi.jsx';

// Layar tertutup: belum masuk -> Login (lalu kembali ke sini); peran salah -> layar utama perannya.
function Guard({ role, children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
  if (role && user.role !== role) return <Navigate to={user.role === 'petugas' ? '/validasi' : '/beranda'} replace />;
  return children;
}
const wisatawan = (el) => <Guard role="wisatawan">{el}</Guard>;

export default function App() {
  return (
    <Routes><Route element={<Layout />}>
      <Route index element={<Start />} /><Route path="start" element={<Start />} />
      <Route path="beranda" element={<Beranda />} /><Route path="jelajah" element={<Jelajah />} />
      <Route path="galeri" element={<Galeri />} /><Route path="data" element={<Data />} />
      <Route path="login" element={<Login />} /><Route path="daftar" element={<Daftar />} />
      <Route path="destinasi/:id" element={<Detail />} />
      <Route path="checkout/:id" element={wisatawan(<Checkout />)} />
      <Route path="tiket/:id" element={wisatawan(<Etiket />)} />
      <Route path="terima-kasih/:id?" element={wisatawan(<TerimaKasih />)} />
      <Route path="riwayat" element={wisatawan(<Riwayat />)} />
      <Route path="akun" element={<Guard><Akun /></Guard>} />
      <Route path="validasi" element={<Guard role="petugas"><Validasi /></Guard>} />
      <Route path="*" element={<Navigate to="/beranda" replace />} />
    </Route></Routes>
  );
}
