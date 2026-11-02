import { ActivityIndicator, Image, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './auth';
import { LOGO } from './images';
import { C, S, T } from './theme';
import { Btn, Screen } from './components/ui';
import TabBar from './components/TabBar';
import Beranda from './screens/Beranda';
import Jelajah from './screens/Jelajah';
import Detail from './screens/Detail';
import Checkout from './screens/Checkout';
import Etiket from './screens/Etiket';
import Riwayat from './screens/Riwayat';
import Akun from './screens/Akun';
import Validasi from './screens/Validasi';
import Login from './screens/Login';
import Daftar from './screens/Daftar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const header = { headerStyle: { backgroundColor: C.olive }, headerTintColor: C.paper, headerTitleStyle: { fontWeight: '600' } };

// Tab "Tiket": petugas melihat Validasi, wisatawan melihat Riwayat, tamu diminta masuk dulu.
function Tiket({ navigation }) {
  const { user } = useAuth();
  if (!user) return <Screen><T style={S.h1}>Tiket saya</T><T>Masuk untuk melihat tiket dan riwayat pesananmu.</T><Btn primary title="Masuk" onPress={() => navigation.navigate('Login')} /></Screen>;
  return user.role === 'petugas' ? <Validasi /> : <Riwayat navigation={navigation} />;
}

function Tabs() {
  const { user } = useAuth();
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={header}>
      <Tab.Screen name="Beranda" component={Beranda} options={{ headerTitle: () => <View style={S.row}><Image source={LOGO} style={{ width: 34, height: 32 }} /><T style={{ color: C.paper, fontSize: 20, fontWeight: '600' }}>Wakaloka</T></View> }} />
      <Tab.Screen name="Jelajah" component={Jelajah} />
      <Tab.Screen name="Tiket" component={Tiket} options={{ title: user?.role === 'petugas' ? 'Validasi' : 'Tiket saya', tabBarLabel: user?.role === 'petugas' ? 'Validasi' : 'Tiket saya' }} />
      <Tab.Screen name="Akun" component={Akun} />
    </Tab.Navigator>
  );
}

function Root() {
  const { ready } = useAuth();
  if (!ready) return <View style={[S.screen, { justifyContent: 'center' }]}><ActivityIndicator size="large" color={C.olive} /></View>;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={header}>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={Detail} options={{ title: 'Detail destinasi' }} />
        <Stack.Screen name="Checkout" component={Checkout} options={{ title: 'Periksa pesanan' }} />
        <Stack.Screen name="Etiket" component={Etiket} options={{ title: 'E-tiket' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Masuk' }} />
        <Stack.Screen name="Daftar" component={Daftar} options={{ title: 'Daftar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return <SafeAreaProvider><AuthProvider><StatusBar style="light" /><Root /></AuthProvider></SafeAreaProvider>;
}
