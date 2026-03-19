import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const { iniciarSesion } = useAuth();
  const [form, setForm] = useState({ usuario: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    const e = {};
    if (!form.usuario.trim()) e.usuario = 'Ingresa tu nombre de usuario';
    if (!form.contrasena.trim()) e.contrasena = 'Ingresa tu contraseña';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validar()) return;
    setCargando(true);
    try {
      const resultado = await iniciarSesion(form.usuario.trim(), form.contrasena);
      if (resultado.exito) {
        navigation.replace(ROUTES.DASHBOARD);
      } else {
        Alert.alert('Acceso denegado', resultado.mensaje);
      }
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Encabezado */}
          <View style={styles.header}>
            <View style={styles.logoSmall}>
              <Ionicons name="leaf" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.appName}>FINCA SAN MANUEL</Text>
            <Text style={styles.appSubtitle}>Gestión Ganadera</Text>
          </View>

          {/* Tarjeta de login */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar sesión</Text>
            <Text style={styles.cardSubtitle}>Ingresa tus credenciales para continuar</Text>

            <Input
              label="Usuario"
              value={form.usuario}
              onChangeText={(t) => setForm({ ...form, usuario: t })}
              placeholder="Nombre de usuario"
              error={errores.usuario}
              autoCapitalize="none"
              leftIcon={<Ionicons name="person-outline" size={18} color={COLORS.textSecondary} />}
              required
            />

            <Input
              label="Contraseña"
              value={form.contrasena}
              onChangeText={(t) => setForm({ ...form, contrasena: t })}
              placeholder="Tu contraseña"
              error={errores.contrasena}
              secureTextEntry
              autoCapitalize="none"
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} />}
              required
            />

            <Button
              title="Iniciar sesión"
              onPress={handleLogin}
              loading={cargando}
              size="lg"
              style={styles.btnLogin}
              icon={<Ionicons name="log-in-outline" size={20} color={COLORS.textWhite} />}
            />

            {/* Credenciales de demo */}
            <View style={styles.demoBox}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.info} />
              <Text style={styles.demoText}>
                Demo: <Text style={styles.demoBold}>admin</Text> / <Text style={styles.demoBold}>admin123</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.footer}>© 2026 Finca San Manuel · v1.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl + SPACING.xl,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  appName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.large,
  },
  cardTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  btnLogin: {
    width: '100%',
    marginTop: SPACING.sm,
  },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.infoLight,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  demoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.info,
    marginLeft: SPACING.xs,
  },
  demoBold: { fontWeight: '700' },
  footer: {
    marginTop: SPACING.xl,
    color: 'rgba(255,255,255,0.5)',
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
  },
});
