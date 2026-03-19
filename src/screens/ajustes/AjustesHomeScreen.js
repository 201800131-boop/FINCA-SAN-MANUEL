import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, EmptyState, SectionHeader } from '../../components/UI';
import { ROUTES } from '../../constants';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const OptionRow = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.optionIcon}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={styles.optionTextWrap}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export const AjustesHomeScreen = ({ navigation }) => {
  const { esAdmin, tienePermiso } = useAuth();
  const puedeVerAjustes = esAdmin() || tienePermiso('puede_ver_ajustes');

  if (!puedeVerAjustes) {
    return <EmptyState title="Acceso restringido" subtitle="Tu usuario no tiene permisos para ver ajustes." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="Administración" />
      <Card>
        {esAdmin() && (
          <OptionRow
            icon="people-outline"
            title="Usuarios"
            subtitle="Crear, editar, activar o desactivar usuarios"
            onPress={() => navigation.navigate(ROUTES.USUARIOS)}
          />
        )}
        {esAdmin() && (
          <OptionRow
            icon="shield-outline"
            title="Permisos"
            subtitle="Definir qué puede hacer cada rol dentro del sistema"
            onPress={() => navigation.navigate(ROUTES.PERMISOS)}
          />
        )}
        <OptionRow
          icon="medkit-outline"
          title="Catálogo de tratamientos"
          subtitle="Registrar tratamientos frecuentes para selección rápida"
          onPress={() => navigation.navigate(ROUTES.CATALOGO_TRATAMIENTOS)}
        />
        <OptionRow
          icon="home-outline"
          title="Datos generales de la finca"
          subtitle="Nombre, logo y configuración general"
          onPress={() => navigation.navigate(ROUTES.CONFIGURACION_FINCA)}
        />
        <OptionRow
          icon="lock-closed-outline"
          title="Seguridad"
          subtitle="Cambio de contraseña, sesiones y respaldo futuro"
          onPress={() => navigation.navigate(ROUTES.CONFIGURACION_FINCA)}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxxl },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  optionIcon: {
    marginRight: SPACING.md,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 19,
  },
});