// Foto dibawa di dalam aplikasi. Backend hanya mengirim nama berkas (kolom foto), dicocokkan di sini.
const FOTO = {
  'assets/img/tomia.jpg': require('../assets/img/tomia.jpg'),
  'assets/img/mangrove.jpg': require('../assets/img/mangrove.jpg'),
  'assets/img/anano.jpg': require('../assets/img/anano.jpg'),
  'assets/img/binongko.jpg': require('../assets/img/binongko.jpg'),
  'assets/img/hoga.jpg': require('../assets/img/hoga.jpg'),
  'assets/img/kontamale.jpg': require('../assets/img/kontamale.jpg'),
};
export const foto = (path) => FOTO[path];
export const HERO = require('../assets/img/hero.jpg');
export const TENUN = require('../assets/img/tenun.jpg');
export const TENUN_LEBAR = require('../assets/img/tenun-lebar.jpg');
export const LOGO = require('../assets/img/logo.png');
