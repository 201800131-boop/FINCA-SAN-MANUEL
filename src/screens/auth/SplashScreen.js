import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { ROUTES } from '../../constants';
import { initDatabase } from '../../database/database';
import { useAuth } from '../../context/AuthContext';

export const SplashScreen = ({ navigation }) => {
  const { usuario, cargando } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
      } catch (e) {
        console.log('Error iniciando DB:', e);
      }
    };
    init();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!cargando) {
      const timer = setTimeout(() => {
        if (usuario) {
          navigation.replace(ROUTES.DASHBOARD);
        } else {
          navigation.replace(ROUTES.LOGIN);
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [cargando, usuario]);

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={64} color={COLORS.primary} />
          </View>
        </View>

        {/* Nombre */}
        <Text style={styles.nombreFinca}>FINCA SAN MANUEL</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitulo}>Sistema de Gestión Ganadera</Text>

        {/* Íconos decorativos */}
        <View style={styles.iconRow}>
          <Ionicons name="water-outline" size={22} color="rgba(255,255,255,0.5)" />
          <Text style={styles.iconSep}>·</Text>
          <Ionicons name="paw-outline" size={22} color="rgba(255,255,255,0.5)" />
          <Text style={styles.iconSep}>·</Text>
          <Ionicons name="nutrition-outline" size={22} color="rgba(255,255,255,0.5)" />
        </View>
      </Animated.View>

      {/* Footer */}
      <Text style={styles.version}>Versión 1.0</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  nombreFinca: {
    fontSize: FONTS.sizes.xxl + 2,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: 3,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 2,
    marginVertical: SPACING.md,
  },
  subtitulo: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    letterSpacing: 1,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  iconSep: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 20,
    marginHorizontal: SPACING.xs,
  },
  version: {
    position: 'absolute',
    bottom: SPACING.xl,
    color: 'rgba(255,255,255,0.5)',
    fontSize: FONTS.sizes.xs,
  },
});
