import { StyleSheet, Text } from 'react-native';

// Warna sama dengan variabel CSS di versi web.
export const C = { ink: '#28321D', olive: '#4F5F26', paper: '#FFF4DF', cream: '#FBE1B5', yellow: '#FFDE59', orange: '#F89254', card: '#FFFAF0', line: '#D9C9A3', err: '#A32A1B', ok: '#E3EDCB', biru: '#2c5b78' };

export const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.paper },
  body: { padding: 16, paddingBottom: 48, gap: 12 },
  t: { color: C.ink, fontSize: 14, lineHeight: 21 },
  h1: { fontSize: 28, fontWeight: '600', lineHeight: 34 },
  h2: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  kicker: { fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: C.olive },
  muted: { fontSize: 12, opacity: 0.75 },
  bold: { fontWeight: '600' },
  panel: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 4, padding: 16, gap: 8 },
  cream: { backgroundColor: C.cream, borderColor: C.cream },
  orange: { backgroundColor: C.orange, borderColor: C.orange },
  note: { borderLeftWidth: 3, borderLeftColor: C.olive, backgroundColor: C.ok, padding: 10, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  alert: { borderWidth: 1.5, borderColor: C.err, backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

// Teks bawaan: warna dan ukuran sama di semua layar.
export const T = ({ style, ...p }) => <Text style={[S.t, style]} {...p} />;
