// Navigasi bawah (padanan komponen "Tab bawah" di Figma): ikon + label, penanda kuning pada tab aktif.
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../auth';
import { C, S, T } from '../theme';

const MUTED = '#5B6446'; // kontras 4,8:1 di atas krem
const IKON = { Beranda: 'home', Jelajah: 'compass', Tiket: 'ticket', Akun: 'person' };

export default function TabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  return (
    <View accessibilityRole="tablist"
      style={{ flexDirection: 'row', backgroundColor: C.cream, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 8, paddingHorizontal: 8, paddingBottom: Math.max(insets.bottom, 8) }}>
      {state.routes.map((route, i) => {
        const fokus = state.index === i;
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const ikon = route.name === 'Tiket' && user?.role === 'petugas' ? 'checkmark-circle' : IKON[route.name];
        const tekan = () => {
          const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!fokus && !e.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable key={route.key} onPress={tekan} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: fokus }}
            style={{ flex: 1, minHeight: 56, alignItems: 'center', gap: 2, paddingTop: 2 }}>
            <View style={{ width: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: fokus ? C.yellow : 'transparent' }}>
              <Ionicons name={fokus ? ikon : `${ikon}-outline`} size={22} color={fokus ? C.ink : MUTED} />
            </View>
            <T style={[S.bold, { fontSize: 12, lineHeight: 16, color: fokus ? C.ink : MUTED, fontWeight: fokus ? '600' : '500' }]}>{label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}
