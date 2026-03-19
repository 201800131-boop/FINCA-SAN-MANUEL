import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/UI';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export const ProximamenteScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Ionicons name="time-outline" size={56} color={COLORS.secondary} />
        <Text style={styles.title}>Próximamente: Gestión de ingresos y egresos</Text>
        <Text style={styles.subtitle}>Este acceso queda visible según tu esquema para futuras ventas de leche, gastos, alimento, mano de obra y reportes financieros.</Text>
        <Text style={styles.caption}>Disponible próximamente</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  card: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginTop: SPACING.lg,
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  caption: {
    marginTop: SPACING.lg,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
});